import { PartialType } from '@nestjs/mapped-types';
import { CreateShopDto } from './create-shop.dto';
import { IsString } from 'class-validator';

export class UpdateShopDto extends PartialType(CreateShopDto) {
	@IsString()
	logo?: string;
}
