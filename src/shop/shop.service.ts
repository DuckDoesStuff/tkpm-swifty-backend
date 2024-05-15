import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { Repository } from 'typeorm';
import { Merchant } from 'src/merchant/entities/merchant.entity';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private shopRepository: Repository<Shop>,
  ) {}

  async createShop(createShopDto: CreateShopDto, merchant: Merchant) {
    try {
      // Check if a shop has already exist and throw error
      const shopExist = await this.shopRepository.findOne({where: {nameId: createShopDto.nameId}});
      if (shopExist) {
        throw new Error('Shop already exist');
      }
      const shop = this.shopRepository.create({
        ...createShopDto,
        merchant,
      });
      return await this.shopRepository.save(shop);
    } catch (error) {
      throw new Error('Failed to create shop');
    }
  }

  findAllShopFromMerchant(merchantId: number) {
    return this.shopRepository.find({where: {merchant: {id: merchantId}}});
  }

  findAll() {
    return this.shopRepository.find();
  }

  async findOne(nameId: string, loadProduct: string) {
    if (loadProduct === 'false') {
      return await this.shopRepository.findOne({where: {nameId}, relations: ['merchant']});
    }
    const shop = await this.shopRepository.findOne({where: {nameId}, relations: ['merchant', 'products']});
  
    if (!shop) {
      throw new HttpException('Shop not found', HttpStatus.NOT_FOUND);
    }
  
    const productCount = shop.products.length;
  
    return {
      ...shop,
      productCount
    };
  }

  updateShop(nameId: string, updateShopDto: UpdateShopDto) {
    return this.shopRepository.update(nameId, updateShopDto);
  }

  removeShop(nameId: string) {
    return this.shopRepository.delete(nameId);
  }
}
