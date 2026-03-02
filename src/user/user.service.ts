import { Injectable ,NotFoundException} from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { IUser } from './user.interface';


@Injectable()
export class UserService {
  test(): any[] {
    return [];
  }
  findAll(): IUser[] {
    const filePath = join(process.cwd(), 'data', 'users.json');

    const data = readFileSync(filePath, 'utf-8');

    return JSON.parse(data) as IUser[];
  }
  findOne(id: string, fields?: string[]) {
    const users = this.findAll();

    const user = users.find(u => u.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // ถ้าไม่ส่ง fields → คืนทั้งหมด
    if (!fields || fields.length === 0) {
      return user;
    }

    // filter fields
    const filtered: Partial<IUser> = {};

    fields.forEach(field => {
      if (field in user) {
        filtered[field as keyof IUser] = user[field as keyof IUser];
      }
    });

    return filtered;
  }
}