import { IsNumber, IsNumberString, IsString } from "class-validator";




export class NewItemCart {
	@IsNumber()
	quantity: number;

	@IsString()
	productId: string;
}
