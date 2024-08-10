import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { AccountsService } from './accounts.service';
import { AccountDto } from './dto/account.dto';

@Resolver(() => AccountDto)
export class AccountsResolver {
  constructor(private accountsService: AccountsService) {}

  @Query(() => [AccountDto])
  async getAccounts(
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<AccountDto[]> {
    return this.accountsService.findAll(skip, limit);
  }

  @Query(() => AccountDto, { nullable: true })
  async getAccountByGuardian(
    @Args('guardianAddress') guardianAddress: string,
  ): Promise<AccountDto | null> {
    return this.accountsService.findByGuardian(guardianAddress);
  }

  @Query(() => AccountDto, { nullable: true })
  async getAccountByAddress(
    @Args('ownerAddress') ownerAddress: string,
  ): Promise<AccountDto | null> {
    return this.accountsService.findByOwner(ownerAddress);
  }
}
