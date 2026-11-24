import { Controller, Get, Query } from '@nestjs/common';
import { ElectricityService } from './electricity.service.js';

@Controller('electricity')
export class ElectricityController {
  constructor(private readonly electricityService: ElectricityService) {}
  @Get()
  getElectricity(@Query('units') units: number, @Query('type') type: string) {
    return this.electricityService.calculate(units, type);
  }
}
