import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Customer } from 'src/customer/entities/customer.entity';
import { stat } from 'fs';
import { Merchant } from 'src/merchant/entities/merchant.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Shop)
    private shopRepository: Repository<Shop>,
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
        order: {createdAt: 'DESC'}
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

  async findAll(customer: Customer, status: string, limit: number, offset: number, orderby: string) {
    const [orders, total] = await this.orderRepository.findAndCount({
        where: {customer, status}, 
        relations: ['product', 'shop', 'product.productImages'],
        take: limit,
        skip: offset,
      });

    if (!orders) {
      return {statusCode: HttpStatus.NOT_FOUND, message: 'No orders found'};
    }
    return {statusCode: HttpStatus.OK, orders, total, totalPages: Math.ceil(total / limit)};
  }

  async update(id: string, shopNameId: string, updateOrderDto: UpdateOrderDto, merchant: Merchant, customer : Customer) {
    const order = await this.orderRepository.findOne({where: {id}, relations: ['product', 'shop', 'shop.merchant', 'customer']});
    if(order.shop.nameId !== shopNameId) {
      return {statusCode: HttpStatus.FORBIDDEN, message: 'Order not from this shop'};
    }

    if (order.status === 'shipping' && updateOrderDto.status == 'canceled') {
      return {statusCode: HttpStatus.FORBIDDEN, message: 'Cannot cancel, order already shipping'};
    }
    
    if (order.status === 'completed') {
      return {statusCode: HttpStatus.FORBIDDEN, message: 'Cannot update completed order'};
    }
    
    if (updateOrderDto.status === 'completed') {
      await this.productRepository.update(order.product.id, 
        {sold: order.product.sold + order.quantity, stock: order.product.stock - order.quantity});
      await this.shopRepository.update(order.shop.nameId, {sold: order.shop.sold + order.quantity, revenue: order.shop.revenue + order.total});
    }

    return this.orderRepository.update(id, updateOrderDto);

  }
}
