import { Module } from '@nestjs/common';
import { CabinetsController } from './cabinets.controller';
import { CabinetsResolver } from './cabinets.resolver';
import { CabinetsService } from './cabinets.service';
import { CabinetsWsGateway } from './cabinets.ws.gateway';

@Module({
  controllers: [CabinetsController],
  providers: [CabinetsService, CabinetsResolver, CabinetsWsGateway],
})
export class CabinetsModule {}
