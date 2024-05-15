import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from './entities/merchant.entity';

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>
  ) {}


  async createMerchant(createMerchantDto: CreateMerchantDto) {
    try {
      const merchant = this.merchantRepository.create(createMerchantDto);
      return await this.merchantRepository.save(merchant);
    } catch (error) {
      if (error.code === '23505') { // 23505 is the code for unique_violation in PostgreSQL
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  findAll() {
    return `This action returns all merchant`;
  }

  findOne(id: string) {
    return this.merchantRepository.findOne({where: {nameId: id}, relations: ['shops']});
  }

  async findOneByEmail(email: string) {
    const merchant = await this.merchantRepository.findOne({where: {email}});
    if(!merchant) {
      throw new HttpException('Merchant not found', HttpStatus.NOT_FOUND);
    }
    return merchant;
  };

  async updateMerchant(id: number, updateMerchantDto: UpdateMerchantDto) {
    const merchant = await this.merchantRepository.findOne({where: {id}});
    if (!merchant) {
      throw new HttpException('Merchant not found', HttpStatus.NOT_FOUND);
    }
    Object.assign(merchant, updateMerchantDto);
    return await this.merchantRepository.save(merchant);
  }

  remove(id: number) {
    return `This action removes a #${id} merchant`;
  }
}
