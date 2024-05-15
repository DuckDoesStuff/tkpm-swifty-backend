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
import { ProductService } from 'src/product/product.service';
import { CartItem } from 'src/cartitem/entities/cartitem.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private productService: ProductService,
  ) {}

  
  async addToCart(newItemCartDto: NewItemCart, customer : Customer) {
    const { productId, quantity } = newItemCartDto;
    const product = await this.productRepository.findOne({where: {id:productId}, relations: ['shop']});
    const cart = await this.cartRepository.findOne({where: {customer: customer}});

    const cartItem = await this.checkIfProductIsInCart(product, cart);

    if (cartItem) {
      this.cartItemRepository.update(cartItem.id, {
        quantity: cartItem.quantity + quantity
      });
      return {statusCode: HttpStatus.BAD_REQUEST, message: 'Updated quantity in cart'};
    }

    this.cartItemRepository.save({
      product,
      cart,
      quantity
    });
    this.cartRepository.update(cart.id, {productCount: cart.productCount + 1});
    await this.cartRepository.save(cart);
    return {statusCode: HttpStatus.OK, message: 'Item added to cart'};
  }

  async removeFromcart(cartItemId: string, customer: Customer) {
    const cartItem = await this.cartItemRepository.findOne({where: {id: cartItemId}, relations: ['cart', 'cart.customer']});
    if (cartItem.cart.customer.id !== customer.id) {
      return {statusCode: HttpStatus.BAD_REQUEST, message: 'Unauthorized'};
    }
    this.cartItemRepository.delete(cartItemId);
    return {statusCode: HttpStatus.OK, message: 'Item removed from cart'};
  }

  async checkIfProductIsInCart(product: Product, cart: Cart) {
    const cartItem = await this.cartItemRepository
    .createQueryBuilder('cartItem')
    .select(['cartItem'])
    .where('cartItem.product = :product', {product: product.id})
    .andWhere('cartItem.cart = :cart', {cart: cart.id})
    .getOne();
    return cartItem;
  }

  async getCart(customer: Customer) {
    const cartItems = await this.cartRepository
    .createQueryBuilder('cart')
    .select(['cart','cartItem', 'product', 'shop', 'productImage'])
    .leftJoin('cart.cartItems', 'cartItem')
    .leftJoin('cartItem.product', 'product')
    .leftJoin('product.shop', 'shop')
    .leftJoin('product.productImages', 'productImage')
    .where('cart.customer = :customer', {customer: customer.id})
    .orderBy('cartItem.createdAt', 'DESC')
    .getOne();
    if (!cartItems) {
      return {statusCode: HttpStatus.NO_CONTENT, message: 'Cart is empty', productCount: 0};
    }
    return cartItems;
  }

  async checkout(customer: Customer) {
    const cart = await this.cartRepository.findOne({where: {customer: customer}});
    const cartItems = await this.cartItemRepository.find({where: {cart: cart}, relations: ['product', 'product.shop']});
    
    cartItems.forEach(async (cartItems) => {
      const product = await this.productRepository.findOne({where: {id: cartItems.product.id}});
      if (cartItems.quantity > product.stock) {
        return {statusCode: HttpStatus.BAD_REQUEST, message: 'Quantity exceeds stock'};
      }
    })

    cartItems.forEach(async (cartItem) => {
      await this.productService.productOrdered(cartItem.product.id, cartItem.quantity);
      this.orderRepository.save({
        customer: customer,
        status: "ordered",
        total: cartItem.product.price * cartItem.quantity,
        product: cartItem.product,
        shop: cartItem.product.shop,
        quantity: cartItem.quantity
      });
    });

    // Delete all items in cart
    await this.cartItemRepository.delete({cart: cart});

    return {statusCode: HttpStatus.OK, message: 'Order placed'}
  }
}