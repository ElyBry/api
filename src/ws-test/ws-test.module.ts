import { Module } from '@nestjs/common';
import { WsTestController } from './ws-test.controller';

@Module({
  controllers: [WsTestController],
})
export class WsTestModule {}

