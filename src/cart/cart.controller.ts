import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
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
}
