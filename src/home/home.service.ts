import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomeDto, HomeResponseDto } from './dto/home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  createHome(createHomeDto: CreateHomeDto) {
    return 'This action adds a new home';
  }

  async getHomes(): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        propertyType: true,
        number_of_bathrooms: true,
        number_of_bedrooms: true,
        image: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
    });
    return homes.map((home) => new HomeResponseDto(home));
  }

  getHome(id: number) {
    return `This action returns a #${id} home`;
  }

  updateHome(id: number, updateHomeDto: UpdateHomeDto) {
    return `This action updates a #${id} home`;
  }

  deleteHome(id: number) {
    return `This action removes a #${id} home`;
  }
}
