import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Account } from './entities/account.entity';
import { Model } from 'mongoose';

describe('AccountsService', () => {
  let service: AccountsService;
  let model: Model<Account>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: getModelToken(Account.name),
          useValue: {
            new: jest.fn().mockResolvedValue({}),
            constructor: jest.fn().mockResolvedValue({}),
            find: jest.fn(),
            findOne: jest.fn(),
            exec: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    model = module.get<Model<Account>>(getModelToken(Account.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new account', async () => {
      const accountData = {
        ownerAddress: '0x123',
        guardianAddress: '0x456',
        transactionHash: '0xabc',
        BlockNumber: 123,
        createdAt: new Date(),
      };

      jest.spyOn(model, 'create').mockImplementationOnce(() =>
        Promise.resolve({
          ...accountData,
          save: jest.fn().mockResolvedValueOnce(accountData),
        } as any),
      );

      const result = await service.create(accountData);
      expect(result).toEqual(accountData);
    });
  });

  describe('findAll', () => {
    it('should return an array of accounts', async () => {
      const accounts = [
        {
          ownerAddress: '0x123',
          guardianAddress: '0x456',
          transactionHash: '0xabc',
          BlockNumber: 123,
          createdAt: new Date(),
        },
      ];
      jest.spyOn(model, 'find').mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValueOnce(accounts),
          }),
        }),
      } as any);

      const result = await service.findAll();
      expect(result).toEqual(accounts);
    });
  });

  describe('findByGuardian', () => {
    it('should find an account by guardian address', async () => {
      const account = {
        ownerAddress: '0x123',
        guardianAddress: '0x456',
        transactionHash: '0xabc',
        BlockNumber: 123,
        createdAt: new Date(),
      };
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(account),
      } as any);

      const result = await service.findByGuardian('0x456');
      expect(result).toEqual(account);
    });
  });

  describe('findByOwner', () => {
    it('should find an account by owner address', async () => {
      const account = {
        ownerAddress: '0x123',
        guardianAddress: '0x456',
        transactionHash: '0xabc',
        BlockNumber: 123,
        createdAt: new Date(),
      };
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(account),
      } as any);

      const result = await service.findByOwner('0x123');
      expect(result).toEqual(account);
    });
  });
});
