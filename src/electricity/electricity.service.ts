import { Injectable, BadRequestException } from '@nestjs/common';

const TYPE_FEE: Record<string, number> = { residential: 40, business: 90}; 

export interface electricityBill {
    units: number;
    type: string;
    energyCharge: number;
    serviceCharge: number;
    total: number;
}
@Injectable()
export class ElectricityService {
    calculate(units: number, type: string): electricityBill {
        const u = Number(units);
        if(u === undefined || u === null || String(u).trim() === '') {
            throw new BadRequestException('units is required');
        }

        if(!Number.isFinite(u)) {
            throw new BadRequestException('units must be a number');
        }
        if(u < 0) {
            throw new BadRequestException('units must be greater than 0');
        }
        
        const t = String(type ?? '').trim().toLowerCase();
        if(!Object.hasOwn(TYPE_FEE, t)) {
            throw new BadRequestException('invalid type');
        }

        let serviceCharge = TYPE_FEE[t];
        let energyCharge = 0;

        if(u <= 150){
            energyCharge = (u * 3);
        }else if(u > 150){
            energyCharge = (150 * 3) + ((u - 150) * 4);
        }else if(u == 0){
            energyCharge = 0;
        }

        const total = energyCharge + serviceCharge;
        
        return {
            units: u,
            type: type,
            energyCharge: energyCharge,
            serviceCharge: serviceCharge,
            total: total
        };
    }
}