import { Customer } from "src/customer/entities/customer.entity";
import { Order } from "src/order/entities/order.entity";
import { Product } from "src/product/entities/product.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@OneToOne(type => Customer, customer => customer.cart)
	customer: Customer;

	@OneToMany(type => Order, order => order.id)
	orders: Order[];

	@Column()
	productCount: number;
}
