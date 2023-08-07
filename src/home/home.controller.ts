import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeResponseDto } from './dto/home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Post()
  createHome(@Body() createHomeDto: CreateHomeDto) {
    return this.homeService.createHome(createHomeDto);
  }

  @Get()
  getHomes(): Promise<HomeResponseDto[]> {
    return this.homeService.getHomes();
  }

  @Get(':id')
  getHome(@Param('id') id: string) {
    return this.homeService.getHome(+id);
  }

  @Patch(':id')
  updateHome(@Param('id') id: string, @Body() updateHomeDto: UpdateHomeDto) {
    return this.homeService.updateHome(+id, updateHomeDto);
  }

  @Delete(':id')
  deleteHome(@Param('id') id: string) {
    return this.homeService.deleteHome(+id);
  }
}
