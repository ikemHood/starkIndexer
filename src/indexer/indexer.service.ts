import { StreamClient, v1alpha2 } from '@apibara/protocol';
import { Filter, FieldElement, v1alpha2 as starknet } from '@apibara/starknet';
import { hash, validateAndParseAddress } from 'starknet';
import { AccountsService } from '../accounts/accounts.service';
import { env } from '../common/env';
import { exit } from 'process';

const ARGENT_PROXY_CLASS_HASH =
  '0x025ec026985a3bf9d0cc1fe17326b245dfdc3ff89b8fde106542a3ea56c5a918';

export class IndexerService {
  constructor(private accountsService: AccountsService) {}

  async onModuleInit() {
    this.startIndexer().catch((error: any) => {
      console.error('Indexer error:', error);
      exit(1);
    });
  }

  private async startIndexer() {
    const address = FieldElement.fromBigInt(BigInt(ARGENT_PROXY_CLASS_HASH));

    const accountCreatedKey = [
      FieldElement.fromBigInt(hash.getSelectorFromName('AccountCreated')),
    ];

    const filter = Filter.create()
      .addEvent((ev) => ev.withFromAddress(address).withKeys(accountCreatedKey))
      .encode();

    const client = new StreamClient({
      url: env.apibara.dnaClient,
      token: env.apibara.token,
    });

    client.configure({
      filter,
      batchSize: 1,
      finality: v1alpha2.DataFinality.DATA_STATUS_ACCEPTED,
    });

    for await (const message of client) {
      if (message.data?.data) {
        for (const item of message.data.data) {
          const block = starknet.Block.decode(item);
          const blockNumber = block.header?.blockNumber;

          for (const { transaction, event } of block.events) {
            const hash = transaction?.meta?.hash;
            if (!event || !event.data || !hash) {
              continue;
            }

            console.log(event.data);

            const ownerAddress = FieldElement.toBigInt(event.data[0]);
            const guardianAddress = FieldElement.toBigInt(event.data[1]);
            const transactionHash = FieldElement.toHex(hash);

            console.log('New Account Created:');
            console.log(`Owner: 0x${ownerAddress.toString(16)}`);
            console.log(`Guardian: 0x${guardianAddress.toString(16)}`);
            console.log(`Transaction Hash: ${transactionHash}`);

            await this.accountsService.create({
              ownerAddress: validateAndParseAddress(
                `0x${ownerAddress.toString(16)}`,
              ),
              guardianAddress: validateAndParseAddress(
                `0x${guardianAddress.toString(16)}`,
              ),
              transactionHash: transactionHash,
              BlockNumber: Number(blockNumber),
              createdAt: new Date(),
            });
          }
        }
      }
    }
  }
}
