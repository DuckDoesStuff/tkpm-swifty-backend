import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

@Controller('merchant')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Post("signin")
  async signIn(@Body() body : any) {
    try {
      const result = await this.merchantService.findOneByEmail(body.email);
      if (!result) {
        throw new HttpException('Merchant not found', HttpStatus.NOT_FOUND);
      }
      return { statusCode: HttpStatus.OK };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Post("signup")
  async signUp(@Body() body : CreateMerchantDto) {
    try {
      const customer = await this.merchantService.createMerchant(body);
      return { statusCode: HttpStatus.OK, data: customer };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Post()
  create(@Body() createMerchantDto: CreateMerchantDto) {
    return this.merchantService.createMerchant(createMerchantDto);
  }

  @Get()
  findAll() {
    return this.merchantService.findAll();
  }

  @Patch(':id')
  async updateMerchant(@Param('id') id: string, @Body() updateMerchantDto: UpdateMerchantDto) {
    try {
      const updatedMerchant = await this.merchantService.updateMerchant(+id, updateMerchantDto);
      return { statusCode: HttpStatus.OK, data: updatedMerchant };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.merchantService.findOneByEmail(email);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.merchantService.remove(+id);
  }
}
