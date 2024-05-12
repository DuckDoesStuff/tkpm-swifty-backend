import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async createCustomer(createCustomerDto: CreateCustomerDto) {
    try {
      const customer = this.customerRepository.create(createCustomerDto);
      return await this.customerRepository.save(customer);
    } catch (error) {
      if (error.code === '23505') { // 23505 is the code for unique_violation in PostgreSQL
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  removeAll() {
    return this.customerRepository.delete({});
  }

  findAll() {
    return `This action returns all customer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  findOneByEmail(email: string) {
    return this.customerRepository.findOne({where: {email}});
  };

  updateCustomer(updateCustomerDto: UpdateCustomerDto, id: number) {
    try {
      return this.customerRepository.update(id, updateCustomerDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
