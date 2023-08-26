import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { CreateHomeDto, HomeResponseDto } from './dto/home.dto';
import { UpdateHomeDto } from './dto/home.dto';
import { PropertyType, User } from '@prisma/client';
import { GetUser } from 'src/user/decorators/user.decorator';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;

    const filters = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };
    return this.homeService.getHomes(filters);
  }

  @Get(':id')
  getHomeById(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.getHomeById(id);
  }

  @Post()
  createHome(@Body() createHomeDto: CreateHomeDto, @GetUser() user: User) {
    return this.homeService.createHome(createHomeDto, user.id);
  }

  @Patch(':id')
  updateHomeById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHomeDto: UpdateHomeDto,
  ) {
    return this.homeService.updateHomeById(id, updateHomeDto);
  }

  @Delete(':id')
  deleteHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.deleteHomeById(id);
  }
}
