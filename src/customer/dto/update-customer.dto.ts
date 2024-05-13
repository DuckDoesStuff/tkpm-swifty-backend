import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
	@IsOptional()
	@IsString()
	address: string;

	@IsOptional()
	@IsString()
	dateOfBirth: string;
	
	@IsOptional()
	@IsString()
	firstName: string;

	@IsOptional()
	@IsString()
	lastName: string;

	@IsOptional()
	@IsString()
	phone: string;

	@IsOptional()
	@IsString()
	photo: string;
}
