import { Controller, Get, Query } from '@nestjs/common';
import { FineService } from './fine.service.js';

@Controller('fine')
export class FineController {
  constructor(private readonly fineService: FineService) {}
  @Get()
  getFine(@Query('days') days: number, @Query('type') type: string) {
    return this.fineService.calculate(days, type);
  }
}
