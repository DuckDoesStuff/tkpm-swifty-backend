import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { IsDate, IsString } from 'class-validator';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
	@IsString()
	address: string;

	@IsString()
	dateOfBirth: string;
	
	@IsString()
	firstName: string;

	@IsString()
	lastName: string;

	@IsString()
	phone: string;

	@IsString()
	photo: string;
}
