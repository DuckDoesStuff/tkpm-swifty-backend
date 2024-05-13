import { Customer } from "src/customer/entities/customer.entity";
import { Order } from "src/order/entities/order.entity";
import { Product } from "src/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@OneToMany(type => Order, order => order.cart)
	orders: Order[];

	@OneToOne(type => Customer, customer => customer.cart)
	@JoinColumn()
	customer: Customer;

	@Column({nullable: true, default: 0})
	productCount: number;
}
