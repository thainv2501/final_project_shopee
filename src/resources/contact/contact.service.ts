import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { FindOptionsWhere, Repository, DataSource } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
    private userService: UserService,
  ) {}

  async create(request, createContactDto: CreateContactDto) {
    const currentUser: User = request[process.env.CURRENT_USER];
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const contact = await this.contactRepository.create(createContactDto);
      const foundUser = await this.userService.getUser({ id: currentUser.id }, [
        'contacts',
      ]);
      await this.contactRepository.save(contact);
      foundUser.contacts.push(contact);
      await this.userRepository.save(foundUser);
      await queryRunner.commitTransaction();
      return { contact };
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      return { err: err.message || 'Unknown error occurred' };
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all contact`;
  }

  async getContact(
    fields: FindOptionsWhere<Contact> | FindOptionsWhere<Contact>[],
    relationOptions?: string[],
  ) {
    return await this.contactRepository.findOne({
      where: fields,
      relations: relationOptions,
    });
  }

  async getContacts(
    fields?: FindOptionsWhere<Contact> | FindOptionsWhere<Contact>[],
    relationOptions?: string[],
  ) {
    return await this.contactRepository.find({
      where: fields,
      relations: relationOptions,
    });
  }

  async getContactsByUserId(userId: string): Promise<Contact[]> {
    const contacts = await this.contactRepository
      .createQueryBuilder('contact')
      .leftJoinAndSelect('contact.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();

    return contacts;
  }

  ownerOfContact(contact: Contact, userId: string) {
    return contact.user.id === userId;
  }

  async update(request, id: string, updateContactDto: UpdateContactDto) {
    const currentUser: User = request[process.env.CURRENT_USER];
    const contact = await this.getContact({ id }, ['user']);
    if (!this.ownerOfContact(contact, currentUser.id)) {
      throw Error('Not allow to edit contact !');
    }
    await this.contactRepository.update({ id }, updateContactDto);
    return `This action updates a #${contact.name} contact`;
  }

  remove(id: number) {
    return `This action removes a #${id} contact`;
  }
}
