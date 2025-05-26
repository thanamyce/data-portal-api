import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Task, TaskSchema } from './task.schema';

@Module({
  imports:[MongooseModule.forFeature([{name :Task.name, schema: TaskSchema}])],
  controllers: [TaskController],
  providers: [TaskService],
  exports:[TaskModule,TaskService]
})
export class TaskModule {}
