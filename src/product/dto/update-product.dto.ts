import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
