import { Injectable, BadRequestException } from '@nestjs/common';

const ZONE_FEE: Record<string, number> = { bangkok: 0, north: 10, south: 25 };
const BASE_PRICE = 50;
const BASE_WEIGHT = 1;
const EXTRA_PER_KG = 18;

export interface ShippingResult {
  weight: number;
  zone: string;
  baseFee: number;
  zoneFee: number;
  total: number;
}

@Injectable()
export class ShippingService {
    calculate(weight: unknown, zone: unknown): ShippingResult {
        if (weight === undefined || weight === null || String(weight).trim() === '') {
            throw new BadRequestException('weight is required');
        }
        const w = Number(weight);
        if (!Number.isFinite(w)) {
            throw new BadRequestException('weight must be a number');
        }
        if (w <= 0) {
            throw new BadRequestException('weight must be greater than 0');
        }

        const z = String(zone ?? '').trim().toLowerCase();
        if (!Object.hasOwn(ZONE_FEE, z)) {
            throw new BadRequestException('invalid zone');
        }

        const extraKg = Math.max(0, Math.ceil(w - BASE_WEIGHT));
        const baseFee = BASE_PRICE + extraKg * EXTRA_PER_KG;
        const zoneFee = ZONE_FEE[z];

        return { weight: w, zone: z, baseFee, zoneFee, total: baseFee + zoneFee };
    }
}
