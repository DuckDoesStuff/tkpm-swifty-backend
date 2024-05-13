import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { SessionService } from 'src/session/session.service';
import { Session } from 'src/session/entities/session.entity';
import { CustomerService } from 'src/customer/customer.service';
import { MerchantService } from 'src/merchant/merchant.service';
import { Customer } from 'src/customer/entities/customer.entity';
import { Merchant } from 'src/merchant/entities/merchant.entity';
import { AuthMiddleware } from 'src/middleware/auth.middleware';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';
import { ProductImage } from 'src/productimage/entities/productimage.entity';
import { Order } from 'src/order/entities/order.entity';
import { Cart } from 'src/cart/entities/cart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shop, Cart]),
    TypeOrmModule.forFeature([Session]),
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Customer]),
    TypeOrmModule.forFeature([Merchant]),
    TypeOrmModule.forFeature([ProductImage]),
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [ShopController],
  providers: [ShopService, SessionService, CustomerService, MerchantService, ProductService],
})
export class ShopModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'shop/:id', method: RequestMethod.GET },
      )
      .forRoutes(ShopController);
  }
}
