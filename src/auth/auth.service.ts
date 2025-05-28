import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>){}

      async checkToken(id: string, token: string): Promise<boolean> {
    const user = await this.userModel.findById(id);
    if (!user?.refreshToken || user.refreshToken !== token) {
      return false;
    }
    return true;
  }
}
