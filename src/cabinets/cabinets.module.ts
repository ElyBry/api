import { Module } from '@nestjs/common';
import { CabinetsController } from './cabinets.controller';
import { CabinetsResolver } from './cabinets.resolver';
import { CabinetsService } from './cabinets.service';

@Module({
  controllers: [CabinetsController],
  providers: [CabinetsService, CabinetsResolver],
})
export class CabinetsModule {}
