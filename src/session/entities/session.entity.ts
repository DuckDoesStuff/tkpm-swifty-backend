import { Customer } from "src/customer/entities/customer.entity";
import { Merchant } from "src/merchant/entities/merchant.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Session {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	sessionCookie: string;

	@OneToOne(() => Customer)
	@JoinColumn()
	customer: Customer;

	@OneToOne(() => Merchant)
	@JoinColumn()
	merchant: Merchant;

	@Column()
	createdAt: Date;
}
