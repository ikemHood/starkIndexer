import { Injectable } from '@nestjs/common';
import { env } from './common/env';

@Injectable()
export class AppService {
  getHello(): { app: string } {
    return {
      app: env.app.name,
    };
  }
}
