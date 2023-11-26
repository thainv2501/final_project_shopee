import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Request } from 'express';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Req() request: Request, @Body() createContactDto: CreateContactDto) {
    return this.contactService.create(request, createContactDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  getContacts() {
    return this.contactService.getContacts(null, ['user']);
  }

  @UseGuards(AuthGuard)
  @Get('/getContacts/:userId')
  getContactsOfUser(@Param('userId') userId: string) {
    return this.contactService.getContactsByUserId(userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getContact(@Req() request: Request, @Param('id') id: string) {
    return this.contactService.getContact({ id }, ['user']);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return this.contactService.update(request, id, updateContactDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(+id);
  }
}
