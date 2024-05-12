import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductImage } from "./entities/productimage.entity";
import { Repository } from "typeorm";


@Injectable()
export class ProductImageService {
	constructor(
		@InjectRepository(ProductImage)
		private productImageRepository: Repository<ProductImage>,
	) {}

	
}