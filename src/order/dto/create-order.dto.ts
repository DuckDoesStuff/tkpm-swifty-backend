import { IsNumberString, IsString } from "class-validator";

export class CreateOrderDto {
	@IsNumberString()
	quantity: number;

	@IsString()
	productId: string;
}
