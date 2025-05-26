import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './task.schema';
import { Model } from 'mongoose';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async createIncompleteTask(
    type: string,
    data: Record<string, any>,
    requiredField: string[],
    semiRequiredField: string[]
  ): Promise<Task> {
    const statements: string[] = [];
    let linkedinId: string = '';

    if (type === 'company') {
      if (!data.linkedinUrl) {
        throw new Error('Missing required field: linkedinUrl');
      }
      linkedinId = data['linkedinUrl'];
    } else if (type === 'contact') {
      if (!data.contactLinkedinProfile) {
        throw new Error('Missing required field: contactLinkedinProfile');
      }
      linkedinId = data['contactLinkedinProfile'];
    }

    // Check semi-required fields
    semiRequiredField.forEach((field) => {
      if (data[field] == null || `${data[field]}`.trim() === '') {
        statements.push(`${field} is missing in data`);
      }
    });

    // Pick only required fields from data
    const reqresult = Object.fromEntries(
      requiredField.map((key) => [key, data[key]])
    );

    const semiresult = Object.fromEntries(
      semiRequiredField.map((key) => [key, data[key]])
    );
    const result = {...reqresult, ...semiresult};
    // Create and return task
    return this.taskModel.create({
      linkedinId,
      type,
      statement: statements,
      data: result,
      status: 'incomplete',
    });
  }
}
