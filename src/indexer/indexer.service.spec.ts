import { Test, TestingModule } from '@nestjs/testing';
import { IndexerService } from './indexer.service';
import { AccountsService } from '../accounts/accounts.service';
import { StreamClient } from '@apibara/protocol';
import { FieldElement, v1alpha2 as starknet } from '@apibara/starknet';
import { StreamDataResponse__Output } from '@apibara/protocol/dist/proto/apibara/node/v1alpha2/StreamDataResponse';

describe('IndexerService', () => {
  let service: IndexerService;
  let accountsService: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IndexerService,
        {
          provide: AccountsService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<IndexerService>(IndexerService);
    accountsService = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('startIndexer', () => {
    it('should process events and create accounts', async () => {
      jest
        .spyOn(StreamClient.prototype, 'configure')
        .mockImplementation(() => {});

      jest
        .spyOn(StreamClient.prototype, Symbol.asyncIterator)
        .mockImplementation(
          async function* (): AsyncGenerator<StreamDataResponse__Output> {
            const block = starknet.Block.encode({
              header: {
                blockNumber: 123,
                timestamp: { seconds: 1691500000 },
              },
              transactions: [
                {
                  transaction: {
                    meta: {
                      hash: FieldElement.fromBigInt(BigInt('0xabc')),
                    },
                  },
                  receipt: {
                    events: [
                      {
                        index: 1,
                        data: [
                          FieldElement.fromBigInt(BigInt('0x123')),
                          FieldElement.fromBigInt(BigInt('0x456')),
                        ],
                      },
                    ],
                  },
                },
              ],
            });

            yield {
              streamId: 'stream-1',
              message: 'data',
              data: {
                data: [block],
              },
            } as unknown as StreamDataResponse__Output;
          },
        );

      await service['startIndexer']();

      expect(accountsService.create).toHaveBeenCalledWith({
        ownerAddress: '0x123',
        guardianAddress: '0x456',
        transactionHash: '0xabc',
        BlockNumber: 123,
        createdAt: expect.any(Date),
      });
    });
  });
});
