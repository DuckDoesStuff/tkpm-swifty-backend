import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Customer } from 'src/customer/entities/customer.entity';
import { stat } from 'fs';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async deleteOrder(id: string, customer: Customer) {
    const order = await this.orderRepository.findOne({where: {customer, id}});
    if (!order) {
      return {statusCode: HttpStatus.NOT_FOUND, message: 'Order not found'};
    }
    this.orderRepository.delete(order.id);
    return {statusCode: HttpStatus.OK, message: 'Order deleted'};
  }

}
