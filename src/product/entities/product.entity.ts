import { ProductImage } from "src/productimage/entities/productimage.entity";
import { Shop } from "src/shop/entities/shop.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Product {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	displayName: string;

	@Column()
	description: string;

	@Column()
	price: number;

	@Column({nullable: true, default: 0})
	stock: number;

	@Column({nullable: true, default: 0})
	sold: number;

	@OneToMany(() => ProductImage, productImage => productImage.product, {
		onDelete: 'CASCADE',
	})
	productImages: ProductImage[];

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne(() => Shop, shop => shop.nameId)
	shop: Shop;
}
