import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { Cart } from 'src/cart/entities/cart.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async createCustomer(createCustomerDto: CreateCustomerDto) {
    try {
      const customer = this.customerRepository.create(createCustomerDto);
      const cart = this.cartRepository.create();
      await this.cartRepository.save(cart);
      await this.customerRepository.save(customer);

      await this.cartRepository.update(cart.id, {customer: customer});
      return this.customerRepository.update(customer.id, {cart: cart});
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
    return this.customerRepository.findOne({where: {id}});
  }

  async findOneByEmail(email: string) {
    const customer = await this.customerRepository.findOne({where: {email}});
    if(!customer) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }
    return customer;
  };

  async updateCustomer(updateCustomerDto: UpdateCustomerDto, id: number) {
    try {
      await this.customerRepository.update(id, updateCustomerDto);
      return this.customerRepository.findOne({where: {id}});
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
