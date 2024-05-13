import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsNumberString, IsString } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
	@IsString()
	status?: string;

	@IsNumberString()
	quantity?: number;
}
