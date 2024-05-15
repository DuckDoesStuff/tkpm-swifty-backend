import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { NewItemCart } from './dto/new-item-cart.dt';
import { Request } from 'express';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  addToCart(@Body() newItemCartDto : NewItemCart, @Req() req: Request) {
    return this.cartService.addToCart(newItemCartDto, req.customer);
  }

  @Get()
  getAllItem(@Req() req: Request){
    return this.cartService.getCart(req.customer);
  }

  @Post('checkout')
  checkout(@Req() req: Request){
    return this.cartService.checkout(req.customer);
  }

  @Delete(':id')
  removeFromCart(@Param('id') id: string, @Req() req: Request) {
    return this.cartService.removeFromcart(id, req.customer);
  }
}
