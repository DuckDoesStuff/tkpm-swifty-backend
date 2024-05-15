import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Request } from 'express';
import { CustomerAuthMiddleware } from 'src/middleware/customerAuth.middleware';
import { SessionService } from 'src/session/session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Session } from 'src/session/entities/session.entity';
import { CustomerService } from 'src/customer/customer.service';
import { MerchantService } from 'src/merchant/merchant.service';
import { Customer } from 'src/customer/entities/customer.entity';
import { Merchant } from 'src/merchant/entities/merchant.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { AuthMiddleware } from 'src/middleware/auth.middleware';
import { Shop } from 'src/shop/entities/shop.entity';
import { ShopService } from 'src/shop/shop.service';
import { Product } from 'src/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Session, Customer, Merchant, Cart, Shop, Product])],
  controllers: [OrderController],
  providers: [OrderService, SessionService, CustomerService, MerchantService, ShopService],
})
export class OrderModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply((req, res, next) => {
    //   console.log(req.method);
    //   console.log(req.url);
    //   next();
    // })
    // .forRoutes(
    //   {path: 'order/:id', method: RequestMethod.PATCH},
    // )

    consumer
    .apply(AuthMiddleware)
    .forRoutes(OrderController);

    consumer
    .apply(CustomerAuthMiddleware)
    .forRoutes(OrderController);
  }
}
