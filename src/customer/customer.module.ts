import { MiddlewareConsumer, Module, NestMiddleware, NestModule, RequestMethod } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { AuthMiddleware } from 'src/middleware/auth.middleware';
import { SessionService } from 'src/session/session.service';
import { Session } from 'src/session/entities/session.entity';
import { MerchantService } from 'src/merchant/merchant.service';
import { Merchant } from 'src/merchant/entities/merchant.entity';
import { CustomerAuthMiddleware } from 'src/middleware/customerAuth.middleware';
import { Order } from 'src/order/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    TypeOrmModule.forFeature([Session]),
    TypeOrmModule.forFeature([Merchant]),
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService, SessionService, MerchantService],
})
export class CustomerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(CustomerAuthMiddleware)
    .forRoutes(
      { path: 'customer', method: RequestMethod.PATCH },
    );
  }
}
