import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CustomerAuthMiddleware } from 'src/middleware/customerAuth.middleware';
import { SessionService } from 'src/session/session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from 'src/session/entities/session.entity';
import { CustomerService } from 'src/customer/customer.service';
import { MerchantService } from 'src/merchant/merchant.service';
import { Customer } from 'src/customer/entities/customer.entity';
import { Merchant } from 'src/merchant/entities/merchant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, Customer, Merchant]),
  ],
  controllers: [CartController],
  providers: [CartService, SessionService, CustomerService, MerchantService],
})
export class CartModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CustomerAuthMiddleware)
      .forRoutes(CartController);
  }
}
