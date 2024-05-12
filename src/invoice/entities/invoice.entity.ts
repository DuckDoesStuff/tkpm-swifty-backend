import { Customer } from "src/customer/entities/customer.entity";
import { Shop } from "src/shop/entities/shop.entity";
import { Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Invoice {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@OneToMany(type => Shop, shop => shop.nameId)
	@JoinColumn()
	shop: Shop

	@OneToMany(type => Customer, customer => customer.id)
	@JoinColumn()
	customer: Customer
}
