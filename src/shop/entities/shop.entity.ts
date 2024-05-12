import { Invoice } from "src/invoice/entities/invoice.entity";
import { Merchant } from "src/merchant/entities/merchant.entity";
import { Order } from "src/order/entities/order.entity";
import { Product } from "src/product/entities/product.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";


@Entity()
export class Shop {
	@PrimaryColumn({unique: true})
	nameId: string;
	
	@Column()
	displayName: string;
	
	@Column()
	description: string;

	@Column()
	address: string;

	@Column()
	phone: string;

	@Column({nullable: true})
	logo: string;

	@Column({nullable: true, default: 0})
	sold: number;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne(() => Merchant, merchant => merchant.shops)
	merchant: Merchant;

	@OneToMany(() => Product, product => product.shop)
	products: Product[];

	@OneToMany(() => Order, order => order.shop)
	orders: Order[];

	@OneToMany(() => Invoice, invoice => invoice.shop)
	invoices: Invoice[];
}
