import { join } from 'node:path';
import { Injectable } from '@nestjs/common';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { GqlOptionsFactory } from '@nestjs/graphql';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { ConfigService } from '@nestjs/config';
import { AppConfig, Environment } from '../env.config';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(private configService: ConfigService<AppConfig, true>) {}

  createGqlOptions(): ApolloDriverConfig {
    const nodeEnv = this.configService.get('nodeEnv', { infer: true });

    return {
      playground: false,
      plugins: [
        nodeEnv === Environment.Production
          ? ApolloServerPluginLandingPageProductionDefault({
              footer: false,
            })
          : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
      ],
      typePaths: [join(process.cwd(), 'src/**/*.graphql')],
      definitions: {
        path: join(process.cwd(), 'src/graphql.schema.ts'),
        outputAs: 'class',
      },
      subscriptions: {
        'graphql-ws': true,
      },
    };
  }
}
