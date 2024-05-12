import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { AuthMiddleware } from 'src/middleware/auth.middleware';
import { Session } from 'src/session/entities/session.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Merchant } from 'src/merchant/entities/merchant.entity';
import { SessionService } from 'src/session/session.service';
import { CustomerService } from 'src/customer/customer.service';
import { MerchantService } from 'src/merchant/merchant.service';
import { Shop } from 'src/shop/entities/shop.entity';
import { ShopService } from 'src/shop/shop.service';
import { ProductImage } from 'src/productimage/entities/productimage.entity';
import { ProductImageService } from 'src/productimage/productimage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Session]),
    TypeOrmModule.forFeature([Customer]),
    TypeOrmModule.forFeature([Merchant]),
    TypeOrmModule.forFeature([Shop]),
    TypeOrmModule.forFeature([ProductImage]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService, 
    SessionService, 
    CustomerService, 
    MerchantService, 
    ShopService,
    ProductImageService,
  ],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware)
    .forRoutes(
      {path: 'product', method: RequestMethod.POST},
      {path: 'product', method: RequestMethod.PATCH},
      {path: 'product', method: RequestMethod.DELETE},
    );
  }
}
