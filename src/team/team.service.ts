import {Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
import {TeamDetails} from "./team-details.entity";
import {TeamInvitation} from "./team-invitation.entity";
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class TeamService {
    constructor(
        @InjectRepository(Team)
        private teamRepository: Repository<Team>,
        @InjectRepository(TeamDetails)
        private teamDetailsRepository: Repository<TeamDetails>,
        @InjectRepository(TeamInvitation)
        private teamInvitationRepository: Repository<TeamInvitation>,
        private notificationService: NotificationService,
    ) {}

    async createTeam(
        title: string,
        description: string,
        tags: string[],
        user_id: number,
        members: number[] = []
    ): Promise<void> {
        const team = this.teamRepository.create({ title, user_id });
        const savedTeam = await this.teamRepository.save(team);

        const team_avatar_color = this.generateRandomHexColor();
        const teamDetails = this.teamDetailsRepository.create({
            tags,
            description,
            team_avatar_color,
            team: savedTeam
        });
        await this.teamDetailsRepository.save(teamDetails);

        if (members && members.length > 0) {
            await this.createTeamInvitations(savedTeam.id, user_id, members);
            await this.sendTeamNotifications(user_id, members, title);
        }
    }

    private async createTeamInvitations(
        teamId: number,
        senderId: number,
        memberIds: number[]
    ): Promise<void> {
        for (const memberId of memberIds) {
            if (memberId !== senderId) {
                try {
                    const existingInvitation = await this.teamInvitationRepository.findOne({
                        where: {
                            team_id: teamId,
                            invited_user_id: memberId,
                            status: 'pending'
                        }
                    });

                    if (!existingInvitation) {
                        const invitation = this.teamInvitationRepository.create({
                            team_id: teamId,
                            invited_user_id: memberId,
                            inviter_user_id: senderId,
                            status: 'pending'
                        });

                        await this.teamInvitationRepository.save(invitation);
                    }
                } catch (error) {
                    console.error(`Błąd tworzenia zaproszenia dla użytkownika ${memberId}:`, error);
                }
            }
        }
    }

    private async sendTeamNotifications(
        senderId: number,
        memberIds: number[],
        teamTitle: string
    ): Promise<void> {
        for (const memberId of memberIds) {
            if (memberId !== senderId) {
                const message = `zaprosił Cię do zespołu "${teamTitle}"`;

                try {
                    await this.notificationService.createNotification(
                        memberId,
                        senderId,
                        message
                    );
                } catch (error) {
                    console.error(`Błąd wysyłania powiadomienia do użytkownika ${memberId}:`, error);
                    // Kontynuuj wysyłanie do pozostałych użytkowników
                }
            }
        }
    }

    async getTeamsByUserId(userId: number): Promise<Team[]> {
        const ownedTeams = await this.teamRepository.find({
            where: { user_id: userId },
            relations: ['team_details', 'creator'],
            order: { created_at: 'DESC' },
        });

        const acceptedInvitations = await this.teamInvitationRepository.find({
            where: {
                invited_user_id: userId,
                status: 'accepted'
            },
            relations: ['team', 'team.team_details', 'team.creator']
        });

        const joinedTeams = acceptedInvitations.map(invitation => invitation.team);
        const allTeams = [...ownedTeams, ...joinedTeams];
        const uniqueTeams = allTeams.filter((team, index, self) =>
            index === self.findIndex(t => t.id === team.id)
        );

        return uniqueTeams.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    async getTeamBySlug(slug: string): Promise<Team | null> {
        return this.teamRepository.findOne({
            where: { slug },
            relations: ['team_details', 'creator'],
        });
    }

    async getTeamInvitationsForUser(userId: number): Promise<{
        sentInvitations: TeamInvitation[],
        receivedInvitations: TeamInvitation[]
    }> {
        const sentInvitations = await this.teamInvitationRepository.find({
            where: {
                inviter_user_id: userId,
                status: 'pending'
            },
            relations: ['team', 'team.team_details', 'invited_user', 'invited_user.profile'],
            order: { created_at: 'DESC' },
        });

        const receivedInvitations = await this.teamInvitationRepository.find({
            where: {
                invited_user_id: userId,
                status: 'pending'
            },
            relations: ['team', 'team.team_details', 'inviter', 'inviter.profile'],
            order: { created_at: 'DESC' },
        });

        return { sentInvitations, receivedInvitations };
    }

    async acceptTeamInvitation(invitationId: number, userId: number): Promise<void> {
        const invitation = await this.teamInvitationRepository.findOne({
            where: {
                id: invitationId,
                invited_user_id: userId,
                status: 'pending'
            }
        });

        if (!invitation) {
            throw new Error('Zaproszenie nie zostało znalezione');
        }

        invitation.status = 'accepted';
        await this.teamInvitationRepository.save(invitation);
    }

    async rejectTeamInvitation(invitationId: number, userId: number): Promise<void> {
        const invitation = await this.teamInvitationRepository.findOne({
            where: {
                id: invitationId,
                invited_user_id: userId,
                status: 'pending'
            }
        });

        if (!invitation) {
            throw new Error('Zaproszenie nie zostało znalezione');
        }

        await this.teamInvitationRepository.remove(invitation);
    }

    generateRandomHexColor(): string {
        return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
    }
}