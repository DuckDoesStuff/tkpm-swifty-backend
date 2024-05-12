import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpStatus, HttpException } from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Request } from 'express';
import { SessionService } from 'src/session/session.service';

@Controller('shop')
export class ShopController {
  constructor(
    private readonly shopService: ShopService, 
    private readonly sessionService : SessionService
  ) {}

  @Post()
  async create(@Body() createShopDto: CreateShopDto, @Req() req: Request) {
    try {
      await this.shopService.createShop(createShopDto, req.merchant);
      return { statusCode: HttpStatus.OK, message: 'Shop created' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get()
  findAll(@Req() req: Request) {
    try {
      return this.shopService.findAllShopFromMerchant(req.merchantId);
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to fetch shops', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':nameId')
  findOne(@Param('nameId') nameId: string) {
    try {
      return this.shopService.findOne(nameId);
    } catch(error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':nameId')
  update(@Param('nameId') nameId: string, @Body() updateShopDto: UpdateShopDto) {
    return this.shopService.updateShop(nameId, updateShopDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.shopService.removeShop(+id);
  // }
}
