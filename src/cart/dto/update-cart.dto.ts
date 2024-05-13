import { PartialType } from '@nestjs/mapped-types';
import { NewItemCart } from './new-item-cart.dt';
import { IsNumberString, IsString } from 'class-validator';

export class UpdateCartDto extends PartialType(NewItemCart) {
	@IsString()
	status?: string;

	@IsNumberString()
	quantity?: number;
}
