import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomeDto, HomeResponseDto } from './dto/home.dto';
import { UpdateHomeDto } from './dto/home.dto';
import { PropertyType } from '@prisma/client';

interface GetHomesParam {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  propertyType: PropertyType;
}

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(filter: GetHomesParam): Promise<HomeResponseDto[]> {
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
      where: filter,
    });

    if (!homes.length) {
      throw new NotFoundException();
    }
    return homes.map((home) => {
      const fetchHomes = { ...home, image: home.image[0].url };
      delete fetchHomes.image;
      return new HomeResponseDto(fetchHomes);
    });
  }

  async getHomeById(id: number) {
    const home = await this.prismaService.home.findFirst({
      where: { id },
    });
    if (!home) {
      throw new NotFoundException();
    }
    return new HomeResponseDto(home);
  }

  async createHome(createHomeDto: CreateHomeDto, userId: number) {
    const {
      address,
      numberOfBedrooms,
      numberOfBathrooms,
      city,
      price,
      landSize,
      propertyType,
      image,
    } = createHomeDto;

    const home = await this.prismaService.home.create({
      data: {
        address,
        number_of_bedrooms: numberOfBedrooms,
        number_of_bathrooms: numberOfBathrooms,
        city,
        price,
        land_size: landSize,
        propertyType,
        realtor_id: userId,
      },
    });

    const homeImages = image.map((img) => {
      return { ...img, home_id: home.id };
    });
    await this.prismaService.image.createMany({
      data: homeImages,
    });
    return new HomeResponseDto(home);
  }

  async updateHomeById(id: number, data: UpdateHomeDto) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id,
      },
    });
    if (!home) throw new NotFoundException('No Home with the said id found');
    const updatedHome = await this.prismaService.home.update({
      where: {
        id,
      },
      data,
    });
    return new HomeResponseDto(updatedHome);
  }

  async deleteHomeById(id: number) {
    await this.prismaService.image.deleteMany({ where: { home_id: id } });
    const deleteHome = await this.prismaService.home.delete({ where: { id } });
  }

  async getRealtorByHomeId(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: { id },
      select: {
        realtor: {
          select: {
            name: true,
            id: true,
            email: true,
            phone: true,
          },
        },
      },
    });
    if (!home) {
      throw new NotFoundException();
    }
    return home.realtor;
  }
}
