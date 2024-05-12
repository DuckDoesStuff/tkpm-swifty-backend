import { Module } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { MerchantController } from './merchant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant } from './entities/merchant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Merchant])],
  controllers: [MerchantController],
  providers: [MerchantService],
})
export class MerchantModule {}
