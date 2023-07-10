import { PropertyType } from "@prisma/client";

export class CreateHomeDto {}

export class HomeResponseDto{
    id: number;
    address: string;
    number_of_bedrooms: number;
    number_of_bathrooms: number;
    city: string;
    listed_date: Date;
    price: number;
    land_size: number;
    propertyType: PropertyType;
    createdAt: Date;
    updatedAt: Date;
    realtor

}
