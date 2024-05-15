import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ShopService } from 'src/shop/shop.service';
import { Merchant } from 'src/merchant/entities/merchant.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { ProductImage } from 'src/productimage/entities/productimage.entity';
import { getStorage } from 'firebase-admin/storage';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
    @InjectRepository(Shop)
    private shopRepository: Repository<Shop>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
  ) {}

  async createProduct(createProductDto: CreateProductDto, merchant: Merchant) {
    try {
      // Check if shop exist and belongs to merchant
      const shopExist = await this.shopRepository.findOne({where: {nameId: createProductDto.shopNameId, merchant: merchant}});
      if (!shopExist) {
        throw new Error('Shop does not exist');
      }
      const newProduct = this.productRepository.create({
        ...createProductDto,
        shop: shopExist
      });
      return this.productRepository.save(newProduct);
    }
    catch (error) {
      throw new Error('Failed to create product');
    }
  }


  async findAll(orderby: string, limit: number, offset: number, loadImg: boolean, shopNameId: string) {
    const [products, total] = loadImg
      ? await this.productRepository.findAndCount({
          where: { shop: { nameId: shopNameId } },
          relations: ['productImages'],
          take: limit,
          skip: offset,
          order: { createdAt: 'ASC' },
        })
      : await this.productRepository.findAndCount({
          where: { shop: { nameId: shopNameId } },
          take: limit,
          skip: offset,
          order: { createdAt: 'ASC' },
        });

    const totalPages = Math.ceil(total / limit);

    return { products, totalPages, total };
  }

  async createProductThumbnail(id: string, thumbnailUrl: string[]) {
    const product = await this.productRepository.findOne({where: {id}});
    if (!product) {
      throw new Error('Product does not exist');
    }
    
    for (let i = 0; i < thumbnailUrl.length; i++) {
      const productImage = this.productImageRepository.create({
        url: thumbnailUrl[i],
        product: product
      });
      await this.productImageRepository.save(productImage);
    }

    
    return {statusCode: 200, message: 'Thumbnail created'};
  }

  async deleteProductThumbnail(id: string) {
    const product = await this.productRepository.findOne({where: {id}, relations: ['productImages']});
    if (!product) {
      throw new Error('Product does not exist');
    }
    await this.productImageRepository.delete({product: product});
    return {statusCode: 200, message: 'Thumbnail deleted'};
  }


  findOneWithId(id: string) {
    return this.productRepository.findOne({where: {id}, relations: ['productImages', 'shop']});
  }

  async removeProduct(id: string) {
    const product = await this.productRepository.findOne({where: {id}});
    if (!product) {
      throw new HttpErrorByCode[HttpStatus.NOT_FOUND]('Product does not exist');
    }
    return this.productRepository.delete({id});
  }

  updateProduct(id: string, updateProductDto: UpdateProductDto) {
    return this.productRepository.update({id}, updateProductDto);
  }

  async productOrdered(productId: string, quantity: number) {
    try {

      const product = await this.productRepository.findOne({where: {id: productId}});
      
      if (!product) {
        throw new HttpErrorByCode[HttpStatus.NOT_FOUND]('Product does not exist');
      }
      
      if (product.stock < quantity) {
        throw new HttpErrorByCode[HttpStatus.BAD_REQUEST]('Product out of stock');
      }
      
      return this.productRepository.update({id: productId}, {stock: product.stock - quantity});
    } catch(error) {
      throw new Error('Failed to update product stock');
    }
  }
}
