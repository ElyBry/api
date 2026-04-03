import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { UsersWsGateway } from './users.ws.gateway';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersResolver, UsersWsGateway],
})
export class UsersModule {}