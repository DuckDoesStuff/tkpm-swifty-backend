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

  async findOrderFromShop(shopNameId: string, limit: number, offset: number, orderby: string, status: string) {
    const [orders, total] = await this.orderRepository.findAndCount(
      {
        where: {shop: {nameId: shopNameId}, status: status != "all" ? status : undefined}, 
        relations: ['product', 'customer', 'shop'],
        take: limit,
        skip: offset,
      });

    if (!orders) {
      return {statusCode: HttpStatus.NOT_FOUND, message: 'No orders found'};
    }
    const totalPages = Math.ceil(total / limit);
    if (!orderby)
      return {orders, total, totalPages};

    switch(orderby) {
      case 'quantity':
        return {orders: orders.sort((a, b) => a.quantity - b.quantity), total, totalPages};
      case 'total':
        return {orders: orders.sort((a, b) => a.total - b.total), total, totalPages};
      case 'createdAt':
        return {orders: orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()), total, totalPages};
      default:
        return {statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid orderby parameter'};
    }
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({where: {id}, relations: ['product', 'customer', 'product.productImages']});
    if (!order) {
      return {statusCode: HttpStatus.NOT_FOUND, message: 'Order not found'};
    }
    return {statusCode: HttpStatus.OK, order};
  }
}
