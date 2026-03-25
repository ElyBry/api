import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Library API')
    .setDescription('REST API библиотеки: шкафы, книги, пользователи. Тестирование: Try it out в Swagger.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  const url = `http://localhost:${port}`;
  console.log(`
  REST (Swagger):  ${url}/api
  GraphQL:         ${url}/graphql
  `);
}
bootstrap();
