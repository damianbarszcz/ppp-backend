import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {MentorProfile} from "./mentor-profile.entity";
import {Repository} from "typeorm";

@Injectable()
export class MentorProfileService {
    constructor(
        @InjectRepository(MentorProfile)
        private mentorProfileRepository: Repository<MentorProfile>,
    ) {}
}