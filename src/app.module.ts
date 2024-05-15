import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';
import { MerchantModule } from './merchant/merchant.module';
import { CartModule } from './cart/cart.module';
import { ProductModule } from './product/product.module';
import { ShopModule } from './shop/shop.module';
import { SessionModule } from './session/session.module';
import { ProductimageModule } from './productimage/productimage.module';
import { OrderModule } from './order/order.module';

require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    CustomerModule,
    MerchantModule,
    CartModule,
    ProductModule,
    ShopModule,
    SessionModule,
    ProductimageModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
