import { UnauthorizedException } from '@nestjs/common';
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
import { CreateHomeDto, HomeResponseDto, InquireDto } from './dto/home.dto';
import { UpdateHomeDto } from './dto/home.dto';
import { PropertyType, User, userType } from '@prisma/client';
import { GetUser } from 'src/user/decorators/user.decorator';
import { Roles } from 'src/user/decorators/roles.decorators';

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

  @Roles(userType.REALTOR, userType.ADMIN)
  @Post()
  createHome(@Body() createHomeDto: CreateHomeDto, @GetUser() user: User) {
    return this.homeService.createHome(createHomeDto, user.id);
  }

  @Roles(userType.BUYER)
  @Patch(':id')
  async updateHomeById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHomeDto: UpdateHomeDto,
    @GetUser() user: User,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);

    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.homeService.updateHomeById(id, updateHomeDto);
  }

  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.deleteHomeById(id);
  }

  @Roles(userType.BUYER)
  @Post('inquire/:id')
  inquire(
    @Param('id', ParseIntPipe) homeId: number,
    @GetUser() user: User,
    @Body() { message }: InquireDto,
  ) {
    return this.homeService.inquire(user, homeId, message);
  }
}
