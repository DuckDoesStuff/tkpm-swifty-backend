import { IsDate, IsString } from "class-validator";


export class CreateShopDto {
	@IsString()
	nameId: string;

	@IsString()
	displayName: string;

	@IsString()
	description: string;

	@IsString()
	address: string;

	@IsString()
	phone: string;
}
