import { Injectable } from '@nestjs/common';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';

@Injectable()
export class HomeService {
  createHome(createHomeDto: CreateHomeDto) {
    return 'This action adds a new home';
  }

  getHomes() {
    return `This action returns all home`;
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
