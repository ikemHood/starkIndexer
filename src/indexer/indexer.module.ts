import { Module } from '@nestjs/common';
import { IndexerService } from './indexer.service';
import { AccountsModule } from '../accounts/accounts.module';
// import { AccountsService } from 'src/accounts/accounts.service';

@Module({
  imports: [AccountsModule],
  providers: [IndexerService],
})
export class IndexerModule {}
