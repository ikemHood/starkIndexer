import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsService } from './accounts.service';
import { AccountsResolver } from './accounts.resolver';
import { Account, AccountSchema } from './entities/account.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
  ],
  providers: [AccountsService, AccountsResolver],
  exports: [AccountsService],
})
export class AccountsModule {}
