import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { User } from '../user/user.entity';
import { Message } from '../message/message.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Message])],
    controllers: [ChannelController],
    providers: [ChannelService],
    exports: [ChannelService],
})
export class ChannelModule {}