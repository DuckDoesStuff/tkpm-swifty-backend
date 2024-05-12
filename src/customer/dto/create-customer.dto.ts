import { IsEmail, IsString } from 'class-validator';



export class CreateCustomerDto {
	@IsEmail()
	email: string;

	@IsString()
	firstName: string;

	@IsString()
	lastName: string;

	@IsString()
	username: string;
}
