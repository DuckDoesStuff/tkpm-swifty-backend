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
import { Cart } from './entities/cart.entity';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { OrderService } from 'src/order/order.service';
import { ProductService } from 'src/product/product.service';
import { ShopService } from 'src/shop/shop.service';
import { Shop } from 'src/shop/entities/shop.entity';
import { ProductImage } from 'src/productimage/entities/productimage.entity';
import { CartItem } from 'src/cartitem/entities/cartitem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, Customer, Merchant, Cart, CartItem, Order, Product, Shop, ProductImage]),
  ],
  controllers: [CartController],
  providers: [CartService, SessionService, CustomerService, MerchantService, OrderService, ProductService, ShopService, ProductImage],
})
export class CartModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CustomerAuthMiddleware)
      .forRoutes(CartController);
  }
}
