import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { CustomerService } from 'src/customer/customer.service';
import { MerchantService } from 'src/merchant/merchant.service';
import { Customer } from 'src/customer/entities/customer.entity';
import { Merchant } from 'src/merchant/entities/merchant.entity';
import { AuthMiddleware } from 'src/middleware/auth.middleware';
import { CustomerAuthMiddleware } from 'src/middleware/customerAuth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session]), 
    TypeOrmModule.forFeature([Customer]), 
    TypeOrmModule.forFeature([Merchant])
  ],
  controllers: [SessionController],
  providers: [SessionService, CustomerService, MerchantService],
})
export class SessionModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware)
    .forRoutes(
      { path: 'session/merchant', method: RequestMethod.GET },
      { path: 'session/merchant', method: RequestMethod.DELETE },
    );

    consumer
    .apply(CustomerAuthMiddleware)
    .forRoutes(
      { path: 'session/customer', method: RequestMethod.GET },
      { path: 'session/customer', method: RequestMethod.DELETE },
    );
  }
}
