import { Injectable, BadRequestException } from '@nestjs/common';

const TYPE_FEE: Record<string, number> = { general: 5, reserve:20, reference: 50 };
const GRACE_PERIOD_DAYS = 3;

export interface FineResult {
    days: number;
    type: string;
    chargeableDays: number;
    rate: number;
    total: number;
}

@Injectable()
export class FineService {
  calculate(days: number, type: string): FineResult {
    const d = Number(days);
    if (d === undefined || d === null || String(d).trim() === '') {
        throw new BadRequestException('days is required');
    }
    if (!Number.isFinite(d)) {
        throw new BadRequestException('days must be a number');
    }
    if (d <= 0) {
        throw new BadRequestException('days must be greater than 0');
    }
    
    const t = String(type ?? '').trim().toLowerCase();
    if (!Object.hasOwn(TYPE_FEE, t)) {
        throw new BadRequestException('invalid type');
    }

    const chargeableDays = Math.max(0, d - GRACE_PERIOD_DAYS);
    const rate = TYPE_FEE[t];
    const total = chargeableDays * rate;

     
    return {days: d, type: t, chargeableDays: chargeableDays, rate: rate, total: Math.min(total, 500)};
  }
}
