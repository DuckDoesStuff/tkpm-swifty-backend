import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { NewItemCart } from './dto/new-item-cart.dt';
import { Customer } from 'src/customer/entities/customer.entity';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductImage } from 'src/productimage/entities/productimage.entity';
import { Shop } from 'src/shop/entities/shop.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async addToCart(newItemCartDto: NewItemCart, customer : Customer) {
    const foundOrder = await this.checkIfProductIsInCart(newItemCartDto.productId, customer);
    if (foundOrder) {
      this.orderRepository.update(foundOrder.id, {quantity: foundOrder.quantity + newItemCartDto.quantity});
      return {statusCode: HttpStatus.BAD_REQUEST, message: 'Updated quantity in cart'};
    }
    const { productId, quantity } = newItemCartDto;
    const product = await this.productRepository.findOne({where: {id:productId}, relations: ['shop']});
    const cart = await this.cartRepository.findOne({where: {customer: customer}});
    this.cartRepository.update(cart.id, {productCount: cart.productCount + 1});
    await this.cartRepository.save(cart);
    const order = this.orderRepository.create({
      quantity: quantity,
      total: product.price * quantity,
      status: 'incart',
      product: product,
      customer: customer,
      shop: product.shop,
      cart: cart
    });
    await this.orderRepository.save(order);
    return {statusCode: HttpStatus.OK, message: 'Item added to cart'};
  }

  async checkIfProductIsInCart(productId: string, customer: Customer) {
    const product = await this.productRepository.findOne({where: {id:productId}});
    const cart = await this.cartRepository.findOne({where: {customer: customer}});
    const order = await this.orderRepository.find({where: {cart}, relations: ['product', 'cart']});
    const foundOrder = order.find(o => o.product.id === product.id);
    return foundOrder;
  }

  async getCart(customer: Customer) {
    const cart = await this.cartRepository
      .createQueryBuilder('cart')
      .select(['cart.id', 'cart.productCount', 'order.id', 'order.quantity', 'order.total', 'product.id', 'product.displayName', 'product.price', 'shop.nameId', 'shop.displayName', 'productImage.url'])
      .innerJoin('cart.orders', 'order', 'order.cartId = cart.id')
      .innerJoin('order.product', 'product', 'product.id = order.productId')
      .innerJoin('order.shop', 'shop', 'shop.nameId = product.shopNameId')
      .leftJoin('product.productImages', 'productImage')
      .where('cart.customerId = :customerId', {customerId: customer.id})
      .getOne();
    if (!cart) {
      return {statusCode: HttpStatus.NO_CONTENT, message: 'Cart is empty'};
    }
    return cart;
  }
}
