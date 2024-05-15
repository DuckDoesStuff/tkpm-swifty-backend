import { Cart } from "src/cart/entities/cart.entity";
import { Customer } from "src/customer/entities/customer.entity";
import { Product } from "src/product/entities/product.entity";
import { Shop } from "src/shop/entities/shop.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Order {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	quantity: number;

	@Column()
	status: string;

	@Column()
	total: number;

	@ManyToOne(type => Product, product => product.id)
	product: Product;

	@ManyToOne(type => Customer, customer => customer.id)
	customer: Customer;

	@ManyToOne(type => Shop, shop => shop.nameId)
	shop: Shop;

	@CreateDateColumn()
	createdAt: Date;
}
