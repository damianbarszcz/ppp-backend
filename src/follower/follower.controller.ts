import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { FollowerService } from './follower.service';
import { Response } from 'express';

@Controller('followers')
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Get(':mentorId')
  async getFollowers(
    @Param('mentorId') mentorId: string,
    @Res() res: Response,
  ): Promise<any> {
    const followers = await this.followerService.getMentorFollowers(
      Number(mentorId),
    );

    return res.status(HttpStatus.OK).json({
      success: true,
      data: followers,
    });
  }

  @Post(':mentorId')
  async followMentor(
    @Param('mentorId') mentorId: string,
    @Body() body: { user_id: number },
    @Res() res: Response,
  ): Promise<any> {
    const follower = await this.followerService.setFollowMentor(
      body.user_id,
      Number(mentorId),
    );

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Zacząłeś obserwować tego mentora',
      data: follower,
    });
  }

  @Delete(':mentorId')
  async unfollowMentor(
    @Param('mentorId') mentorId: string,
    @Body() body: { user_id: number },
    @Res() res: Response,
  ): Promise<any> {
    const follower = await this.followerService.setUnfollowMentor(
      body.user_id,
      Number(mentorId),
    );

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Przestałeś obserwować tego mentora',
      data: follower,
    });
  }

  @Get('check/:userId/:mentorId')
  async checkIfFollowing(
    @Param('userId') userId: number,
    @Param('mentorId') mentorId: number,
    @Res() res: Response,
  ): Promise<any> {
    const isFollowing = await this.followerService.isFollowing(
      userId,
      mentorId,
    );

    return res.status(HttpStatus.OK).json({
      success: true,
      data: { isFollowing },
    });
  }
}
