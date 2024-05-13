import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Request } from 'express';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Delete(':id')
  deleteOrder(@Param('id') id: string, @Req() req: Request) {
    return this.orderService.deleteOrder(id, req.customer);
  }

  @Get()
  findOrderFromShop(@Query('status') status: string, @Query('shop') shopNameId: string, @Query('limit') limit: string, @Query('offset') offset: string, @Query('orderby') orderby:string, @Req() req: Request){
    try {
      const limitInt = parseInt(limit) || 5;
      const offsetInt = parseInt(offset) || 0;
      return this.orderService.findOrderFromShop(shopNameId, limitInt, offsetInt, orderby, status);
    }
    catch (e) {
      return e;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

}
