import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import * as admin from 'firebase-admin';
import { CustomerService } from 'src/customer/customer.service';
import { MerchantService } from 'src/merchant/merchant.service';
import { Customer } from 'src/customer/entities/customer.entity';
import { Merchant } from 'src/merchant/entities/merchant.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    private customerService: CustomerService,
    private merchantService: MerchantService,
  ) {}

  async createCustomerSessionCookie(tokenId: string, customerEmail:string) : Promise<string>{
    try {
      const oldSession = await this.sessionRepository.findOne({where: {customer: {email: customerEmail}}});
      if (oldSession) {
        await this.sessionRepository.delete(oldSession.id);
      }
      const expiresIn = 60 * 60 * 24 * 7 * 1000;
      const sessionCookie = await admin.auth().createSessionCookie(tokenId, { expiresIn });
      const customer = await this.customerService.findOneByEmail(customerEmail);
      if (!customer) {
        throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
      }


      const session = this.sessionRepository.create({ sessionCookie, customer, createdAt: new Date() });
      await this.sessionRepository.save(session);
      return sessionCookie;
    } catch (error) {
      console.log(error);
      throw new HttpException('Failed to create session cookie', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createMerchantSessionCookie(tokenId: string, merchantEmail:string): Promise<string> {
    try {
      // Look for old session and delete it
      const oldSession = await this.sessionRepository.findOne({where: {merchant: {email: merchantEmail}}});
      if (oldSession) {
        await this.sessionRepository.delete(oldSession.id);
      }
      const expiresIn = 60 * 60 * 24 * 7 * 1000;
      const sessionCookie = await admin.auth().createSessionCookie(tokenId, { expiresIn });
      const merchant = await this.merchantService.findOneByEmail(merchantEmail);
      if (!merchant) {
        throw new HttpException('Merchant not found', HttpStatus.NOT_FOUND);
      }
      const session = this.sessionRepository.create({ sessionCookie, merchant, createdAt: new Date() });
      await this.sessionRepository.save(session);
      return sessionCookie;
    } catch (error) {
      throw new HttpException('Failed to create session cookie', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getCustomerData(sessionCookie: string) : Promise<Customer> {
    try {
      const session = await this.sessionRepository.findOne({where: {sessionCookie}, relations: ['customer']});
      if (!session) {
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }
      return session.customer;
    } catch (error) {
      throw new HttpException('Failed to get customer data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getMerchantData(sessionCookie: string) : Promise<Merchant> {
    try {
      const session = await this.sessionRepository.findOne({where: {sessionCookie}, relations: ['merchant']});
      if (!session) {
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }
      return session.merchant;
    } catch (error) {
      throw new HttpException('Failed to get merchant data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getCustomerId(sessionCookie: string): Promise<number> {
    try {
      const session = await this.sessionRepository.findOne({where: {sessionCookie}, relations: ['customer']});
      if (!session) {
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }
      return session.customer.id;
    } catch (error) {
      throw new HttpException('Failed to get customer id', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getMerchantId(sessionCookie: string): Promise<number> {
    try {
      const session = await this.sessionRepository.findOne({where: {sessionCookie}, relations: ['merchant']});
      if (!session) {
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }
      return session.merchant.id;
    } catch (error) {
      throw new HttpException('Failed to get merchant id', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
