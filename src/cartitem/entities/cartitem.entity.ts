import { Cart } from "src/cart/entities/cart.entity";
import { Product } from "src/product/entities/product.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class CartItem {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({default: 0})
	quantity:number;

	@ManyToOne(() => Cart, cart => cart.cartItems)
	cart: Cart;

	@ManyToOne(() => Product, product => product.id)
	product: Product;

	@CreateDateColumn()
	createdAt: Date;
}