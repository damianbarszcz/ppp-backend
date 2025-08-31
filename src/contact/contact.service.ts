import {ConflictException, Injectable,NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import {User} from "../user/user.entity";
import { ContactDto } from '../dto/contact/contact.dto';
import {NotificationService} from "../notification/notification.service";

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(Contact)
        private contactRepository: Repository<Contact>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private notificationService: NotificationService,
    ) {}

    public async getMyContacts(userId: number): Promise<Contact[]> {
        const sentContacts = await this.contactRepository.find({
            where: {
                user_id: userId,
                status: 'accepted'
            },
            relations: ['contact_user', 'contact_user.profile'],
            order: { created_at: 'DESC' },
        });

        const receivedContacts = await this.contactRepository.find({
            where: {
                contact_user_id: userId,
                status: 'accepted'
            },
            relations: ['creator', 'creator.profile'],
            order: { created_at: 'DESC' },
        });

        const mappedReceivedContacts = receivedContacts.map(contact => ({
            ...contact,
            contact_user: contact.creator,
            creator: undefined
        }));

        const allContacts = [...sentContacts, ...mappedReceivedContacts];
        return allContacts.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    public async getReceivedInvitations(userId: number): Promise<Contact[]> {
        return this.contactRepository.find({
            where: {
                contact_user_id: userId,
                status: 'pending'
            },
            relations: ['creator', 'creator.profile'],
            order: { created_at: 'DESC' },
        });
    }

    public async getInvitationsContact(userId: number): Promise<Contact[]> {
        return this.contactRepository.find({
            where: {
                user_id: userId,
                status: 'pending'
            },
            relations: ['contact_user', 'contact_user.profile'],
            order: { created_at: 'DESC' },
        });
    }

    public async sendContactInvitation(ContactDto: ContactDto): Promise<Contact> {
        const { username, user_id } = ContactDto;

        const targetUser = await this.checkUsername(username);

        if (targetUser.id === user_id) {
            throw new ConflictException({
                success: false,
                errors: [{
                    field: 'username',
                    message: 'Nie możesz dodać siebie do kontaktów'
                }]
            });
        }

        await this.checkInvitationExists(user_id, targetUser.id);

        const contact: Contact = this.contactRepository.create({
            contact_user_id: targetUser.id,
            user_id: user_id,
            status: 'pending'
        });

        const savedContact = await this.contactRepository.save(contact);

        const senderUser = await this.userRepository.findOne({
            where: { id: user_id },
            relations: ['profile']
        });

        if (senderUser) {
            const message = `zaprosił Cię do kontaktów`;
            await this.notificationService.createNotification(
                targetUser.id,
                user_id,
                message
            );
        }

        return savedContact;
    }

    public async acceptInvitation(userId: number, contactId: number): Promise<Contact> {
        const contact = await this.contactRepository.findOne({
            where: {
                id: contactId,
                contact_user_id: userId,
                status: 'pending'
            }
        });

        if (!contact) {
            throw new NotFoundException({
                success: false,
                errors: [{
                    field: 'general',
                    message: 'Zaproszenie nie zostało znalezione'
                }]
            });
        }

        contact.status = 'accepted';
        return await this.contactRepository.save(contact);
    }

    public async rejectInvitation(userId: number, contactId: number): Promise<void> {
        const contact = await this.contactRepository.findOne({
            where: {
                id: contactId,
                contact_user_id: userId,
                status: 'pending'
            }
        });

        if (!contact) {
            throw new NotFoundException({
                success: false,
                errors: [{
                    field: 'general',
                    message: 'Zaproszenie nie zostało znalezione'
                }]
            });
        }

        await this.contactRepository.remove(contact);
    }

    private async checkUsername(username: string): Promise<User> {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.profile', 'profile')
            .where('profile.username = :username', { username })
            .getOne();

        if (!user) {
            throw new NotFoundException({
                success: false,
                errors: [{
                    field: 'username',
                    message: 'Użytkownik o podanej nazwie nie istnieje'
                }]
            });
        }

        return user;
    }

    private async checkInvitationExists(userId: number, contactUserId: number): Promise<void> {
        const existingInvitation = await this.contactRepository
            .createQueryBuilder('contact')
            .where(
                '(contact.user_id = :userId AND contact.contact_user_id = :contactUserId) ' +
                'OR (contact.user_id = :contactUserId AND contact.contact_user_id = :userId)',
                { userId, contactUserId }
            )
            .getOne();

        if (existingInvitation) {
            let message = '';

            if (existingInvitation.status === 'pending') {
                if (existingInvitation.user_id === userId) {
                    message = 'Już wysłałeś zaproszenie do tego użytkownika';
                } else {
                    message = 'Ten użytkownik już wysłał Ci zaproszenie do kontaktów';
                }
            } else if (existingInvitation.status === 'accepted') {
                message = 'Ten użytkownik jest już w Twoich kontaktach';
            }

            throw new ConflictException({
                success: false,
                errors: [{
                    field: 'username',
                    message: message
                }]
            });
        }
    }
}