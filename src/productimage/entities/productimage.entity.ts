import { Product } from "src/product/entities/product.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class ProductImage {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	url: string;

	@ManyToOne(() => Product, product => product.id, {
		onDelete: 'CASCADE',
	})
	product: Product;

	@CreateDateColumn()
	createdAt: Date;
}