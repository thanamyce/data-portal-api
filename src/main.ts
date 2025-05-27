import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  app.use(
    session({
      secret: 'your-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }, // 1 hour
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3001', // your frontend URL
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001,()=>{
    console.log("server running on port 3001")
  });
}
bootstrap();
