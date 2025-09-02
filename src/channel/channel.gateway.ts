import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { ChannelService } from './channel.service';

interface ChannelUser {
    userId: number;
    teamId: number;
    socketId: string;
    joinedAt: Date;
    lastHeartbeat: Date;
}

@Injectable()
@WebSocketGateway({
    cors: {
        origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://18.184.15.158/'],
        credentials: true,
    },
    namespace: '/channel'
})
export class ChannelGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private channelUsers = new Map<string, ChannelUser>();
    private userHeartbeats = new Map<string, NodeJS.Timeout>();
    private socketInstances = new Map<string, Socket>();

    constructor(private readonly channelService: ChannelService) {
        setInterval(() => {
            this.cleanupInactiveUsers();
        }, 30000);
    }

    handleConnection(client: Socket) {
        this.socketInstances.set(client.id, client);
    }

    handleDisconnect(client: Socket) {
        this.socketInstances.delete(client.id);
        this.handleUserLeave(client);
    }

    @SubscribeMessage('join-channel')
    async handleJoinChannel(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { teamId: number; userId: number }
    ) {
        const { teamId, userId } = data;

        try {
            await this.channelService.joinChannel(teamId, userId);

            const channelUser: ChannelUser = {
                userId,
                teamId,
                socketId: client.id,
                joinedAt: new Date(),
                lastHeartbeat: new Date()
            };

            this.channelUsers.set(client.id, channelUser);

            client.join(`team-${teamId}`);
            client.to(`team-${teamId}`).emit('user-joined', {
                userId,
                timestamp: new Date()
            });

            const participants = await this.channelService.getActiveParticipants(teamId);
            this.server.to(`team-${teamId}`).emit('participants-updated', participants);
            this.setupHeartbeat(client.id);

        } catch (error) {
            client.emit('error', { message: 'Failed to join channel' });
        }
    }

    @SubscribeMessage('leave-channel')
    async handleLeaveChannel(@ConnectedSocket() client: Socket) {
        await this.handleUserLeave(client);
    }

    @SubscribeMessage('heartbeat')
    handleHeartbeat(@ConnectedSocket() client: Socket) {
        const user = this.channelUsers.get(client.id);
        if (user) {
            user.lastHeartbeat = new Date();
            this.channelUsers.set(client.id, user);
        }
    }

    @SubscribeMessage('offer')
    handleOffer(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { targetUserId: number; offer: any }
    ) {
        const user = this.channelUsers.get(client.id);
        if (user) {
            const targetSocket = this.findUserSocket(data.targetUserId, user.teamId);
            if (targetSocket) {
                targetSocket.emit('offer', {
                    fromUserId: user.userId,
                    offer: data.offer
                });
            }
        }
    }

    @SubscribeMessage('answer')
    handleAnswer(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { targetUserId: number; answer: any }
    ) {
        const user = this.channelUsers.get(client.id);
        if (user) {
            const targetSocket = this.findUserSocket(data.targetUserId, user.teamId);
            if (targetSocket) {
                targetSocket.emit('answer', {
                    fromUserId: user.userId,
                    answer: data.answer
                });
            }
        }
    }

    @SubscribeMessage('ice-candidate')
    handleIceCandidate(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { targetUserId: number; candidate: any }
    ) {
        const user = this.channelUsers.get(client.id);
        if (user) {
            const targetSocket = this.findUserSocket(data.targetUserId, user.teamId);
            if (targetSocket) {
                targetSocket.emit('ice-candidate', {
                    fromUserId: user.userId,
                    candidate: data.candidate
                });
            }
        }
    }

    @SubscribeMessage('user-stream-state-changed')
    handleStreamStateChanged(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { hasVideo: boolean; hasAudio: boolean }
    ) {
        const user = this.channelUsers.get(client.id);
        if (user) {
            client.to(`team-${user.teamId}`).emit('user-stream-state-changed', {
                userId: user.userId,
                ...data
            });
        }
    }

    private async handleUserLeave(client: Socket) {
        const user = this.channelUsers.get(client.id);
        if (user) {
            try {
                await this.channelService.leaveChannel(user.teamId, user.userId);
                this.channelUsers.delete(client.id);

                if (this.userHeartbeats.has(client.id)) {
                    clearInterval(this.userHeartbeats.get(client.id));
                    this.userHeartbeats.delete(client.id);
                }
                this.socketInstances.delete(client.id);
                client.leave(`team-${user.teamId}`);
                client.to(`team-${user.teamId}`).emit('user-left', {
                    userId: user.userId,
                    timestamp: new Date()
                });

                const participants = await this.channelService.getActiveParticipants(user.teamId);
                this.server.to(`team-${user.teamId}`).emit('participants-updated', participants);

            } catch (error) {
                console.error('Error leaving channel:', error);
            }
        }
    }

    private setupHeartbeat(socketId: string) {
        if (this.userHeartbeats.has(socketId)) {
            clearInterval(this.userHeartbeats.get(socketId));
        }

        const heartbeat = setInterval(() => {
            const user = this.channelUsers.get(socketId);
            if (user) {
                const now = new Date();
                const timeSinceLastHeartbeat = now.getTime() - user.lastHeartbeat.getTime();

                if (timeSinceLastHeartbeat > 60000) {
                    const socket = this.socketInstances.get(socketId);
                    if (socket) {
                        this.handleUserLeave(socket);
                    }
                }
            }
        }, 10000);

        this.userHeartbeats.set(socketId, heartbeat);
    }

    private cleanupInactiveUsers() {
        const now = new Date();
        const usersToRemove: string[] = [];

        this.channelUsers.forEach((user, socketId) => {
            const timeSinceLastHeartbeat = now.getTime() - user.lastHeartbeat.getTime();
            if (timeSinceLastHeartbeat > 90000) {
                usersToRemove.push(socketId);
            }
        });

        usersToRemove.forEach(socketId => {
            const socket = this.socketInstances.get(socketId);
            if (socket) {
                this.handleUserLeave(socket);
            }
        });
    }

    private findUserSocket(userId: number, teamId: number): Socket | null {
        for (const [socketId, user] of this.channelUsers.entries()) {
            if (user.userId === userId && user.teamId === teamId) {
                const socket = this.socketInstances.get(socketId);
                if (socket) {
                    return socket;
                } else {
                    this.channelUsers.delete(socketId);
                    return null;
                }
            }
        }
        return null;
    }
}