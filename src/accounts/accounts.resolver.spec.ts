import { Test, TestingModule } from '@nestjs/testing';
import { AccountsResolver } from './accounts.resolver';
import { AccountsService } from './accounts.service';
import { Account } from './entities/account.entity';

describe('AccountsResolver', () => {
  let resolver: AccountsResolver;
  let service: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsResolver,
        {
          provide: AccountsService,
          useValue: {
            findAll: jest.fn(),
            findByGuardian: jest.fn(),
            findByOwner: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<AccountsResolver>(AccountsResolver);
    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getAccounts', () => {
    it('should return an array of accounts', async () => {
      const result: Partial<Account>[] = [
        {
          ownerAddress: '0x123',
          guardianAddress: '0x456',
          transactionHash: '0xabc',
          BlockNumber: 123,
          createdAt: new Date(),
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(result as Account[]);

      expect(await resolver.getAccounts(0, 10)).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(0, 10);
    });
  });

  describe('getAccountByGuardian', () => {
    it('should return an account by guardian address', async () => {
      const result: Partial<Account> = {
        ownerAddress: '0x123',
        guardianAddress: '0x456',
        transactionHash: '0xabc',
        BlockNumber: 123,
        createdAt: new Date(),
      };
      jest
        .spyOn(service, 'findByGuardian')
        .mockResolvedValue(result as Account);

      expect(await resolver.getAccountByGuardian('0x456')).toBe(result);
      expect(service.findByGuardian).toHaveBeenCalledWith('0x456');
    });
  });

  describe('getAccountByAddress', () => {
    it('should return an account by owner address', async () => {
      const result: Partial<Account> = {
        ownerAddress: '0x123',
        guardianAddress: '0x456',
        transactionHash: '0xabc',
        BlockNumber: 123,
        createdAt: new Date(),
      };
      jest.spyOn(service, 'findByOwner').mockResolvedValue(result as Account);

      expect(await resolver.getAccountByAddress('0x123')).toBe(result);
      expect(service.findByOwner).toHaveBeenCalledWith('0x123');
    });
  });
});
