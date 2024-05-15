import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Req, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request } from 'express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto, @Req() req: Request) {
    try {
      return this.productService.createProduct(createProductDto, req.merchant);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create product');
    }
  }

  @Post("/thumbnail/:id")
  createThumbnail(@Param('id') id: string, @Body() thumbnailUrl: string[]) {
    try {
      return this.productService.createProductThumbnail(id, thumbnailUrl);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update thumbnail');
    }
  }

  @Delete("/thumbnail/:id")
  deleteThumbnail(@Param('id') id: string) {
    try {
      return this.productService.deleteProductThumbnail(id);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update thumbnail');
    }
  }

  @Get()
  getAll(@Query('shop') shopNameId: string, @Query('orderby') orderby: string, @Query('limit') limit: string, @Query('offset') offset: string, @Query('loadImg') loadImg: string) {
    const limitInt = limit ? parseInt(limit, 10) : 10;
    const offsetInt = offset ? parseInt(offset, 10) : 0;
    const loadImgBool = loadImg === 'true';
    
    return this.productService.findAll(orderby, limitInt, offsetInt, loadImgBool, shopNameId);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.productService.findOneWithId(id);
  }

  @Patch(':id')
  updateProduct(@Body() body: UpdateProductDto, @Param('id') id: string) {
    try {
      return this.productService.updateProduct(id, body);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update product');
    }
  }

  @Patch("/thumbnail/:id")
  updateThumbnail(@Param('id') id:string, @Body() thumbnailUrl: string[]) {
    try {
    console.log(thumbnailUrl);
      return;
      // return this.productService.updateProductThumbnail(id, thumbnailUrl);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update thumbnail');
    }
  }


  // @Get()
  // findAll() {
  //   return this.productService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.productService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Req() req: Request) {
  //   return this.productService.updateProduct(id, updateProductDto, req.merchant);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productService.removeProduct(id);
  // }
}
