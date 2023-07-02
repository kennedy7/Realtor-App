import { PartialType } from '@nestjs/mapped-types';
import { CreateHomeDto } from './home.dto';

export class UpdateHomeDto extends PartialType(CreateHomeDto) {}
