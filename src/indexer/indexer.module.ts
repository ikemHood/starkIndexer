import { Module } from '@nestjs/common';
import { IndexerService } from './indexer.service';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [AccountsModule],
  providers: [IndexerService],
})
export class IndexerModule {}
