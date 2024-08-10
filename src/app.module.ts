import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsModule } from './accounts/accounts.module';
import { IndexerModule } from './indexer/indexer.module';
import { env } from './common/env';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    MongooseModule.forRoot(env.db.url),
    AccountsModule,
    IndexerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
