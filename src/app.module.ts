import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { TeamModule } from "./team/team.module";
import { MessageModule } from "./message/message.module";
import { ContactModule } from "./contact/contact.module";
import { ArticleModule } from "./article/article.module";
import { FollowerModule } from "./follower/follower.module";
import { SubscriptionModule } from './subscriptions/subscription.module';
import { SettingsModule } from "./settings/settings.module";
import { PaymentModule } from "./payment/payment.module";
import { MentorProfileModule } from "./mentor-profile/mentor-profile.module";
import { ChannelModule } from "./channel/channel.module";
import { NotificationModule } from "./notification/notification.module";
import {ProspectorProfileModule} from "./prospector-profile/prospector-profile.module";
import {SearchModule} from "./search/search.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    AuthModule,
    TeamModule,
    ContactModule,
    MessageModule,
    ArticleModule,
    FollowerModule,
    SubscriptionModule,
    SettingsModule,
    PaymentModule,
    MentorProfileModule,
    ChannelModule,
    NotificationModule,
    ProspectorProfileModule,
    SearchModule
  ],
})
export class AppModule {}
