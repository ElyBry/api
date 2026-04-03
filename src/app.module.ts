import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'node:path';
import { DatabaseModule } from './database/database.module';
import { CabinetsModule } from './cabinets/cabinets.module';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { WsTestModule } from './ws-test/ws-test.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    DatabaseModule,
    CabinetsModule,
    BooksModule,
    UsersModule,
    WsTestModule,
    ChatModule,
  ],
})
export class AppModule {}
