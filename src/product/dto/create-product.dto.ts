import { IsNumber, IsString } from "class-validator";



export class CreateProductDto {
	@IsString()
	displayName: string;

	@IsString()
	description: string;

	@IsNumber()
	price: number;

	@IsNumber()
	stock: number;

	@IsString()
	shopNameId: string;
}
