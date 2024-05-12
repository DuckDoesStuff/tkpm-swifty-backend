import { Cart } from "src/cart/entities/cart.entity"
import { Invoice } from "src/invoice/entities/invoice.entity"
import { Order } from "src/order/entities/order.entity"
import { Column, JoinColumn, OneToOne, Entity, PrimaryGeneratedColumn, Unique, OneToMany } from "typeorm"



@Entity()
@Unique(['email'])
export class Customer {
	@PrimaryGeneratedColumn()
	id:number

	@Column()
	email:string

	@Column({nullable:true})
	username:string

	@Column({nullable:true})
	firstName:string

	@Column({nullable:true})
	lastName:string

	@Column({nullable:true})
	phone:string

	@Column({nullable:true})
	address:string

	@Column({nullable:true})
	dateOfBirth: Date

	@Column({nullable:true})
	photo: string

	@OneToOne(type => Cart, cart => cart.customer)
	@JoinColumn()
	cart: Cart

	@OneToMany(type => Order, order => order.customer)
	orders: Order[]

	@OneToMany(type => Invoice, invoice => invoice.customer)
	invoices: Invoice[]
}
