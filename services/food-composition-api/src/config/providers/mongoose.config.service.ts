import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { AppConfig } from '../env.config';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService<AppConfig, true>) {}

  createMongooseOptions(): MongooseModuleOptions {
    const db = this.configService.get('database', { infer: true });

    return {
      uri: `mongodb://${db.host}:${db.port}`,
      user: db.user,
      pass: db.password,
      dbName: db.dbName,
    };
  }
}
