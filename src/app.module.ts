import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { ContactModule } from './contact/contact.module';
import { DataModule } from './data/data.module';
import { TaskModule } from './task/task.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { FetchdataModule } from './fetchdata/fetchdata.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:'.env'
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/mydb',
      }),
      inject: [ConfigService],
    }),CompanyModule, ContactModule, DataModule, TaskModule,FetchdataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
