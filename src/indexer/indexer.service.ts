import { StreamClient, v1alpha2 } from '@apibara/protocol';
import { Filter, FieldElement, v1alpha2 as starknet } from '@apibara/starknet';
import { validateAndParseAddress } from 'starknet';
import { AccountsService } from '../accounts/accounts.service';
import { env } from '../common/env';
import { exit } from 'process';
import { Inject, Injectable, Logger } from '@nestjs/common';

const ARGENT_PROXY_CLASS_HASH =
  '0x025ec026985a3bf9d0cc1fe17326b245dfdc3ff89b8fde106542a3ea56c5a918';
@Injectable()
export class IndexerService {
  private readonly logger = new Logger(IndexerService.name);

  constructor(@Inject() private readonly accountsService: AccountsService) {}

  async onModuleInit() {
    this.startIndexer().catch((error: any) => {
      this.logger.error('Indexer error:', error);
      exit(1); //TODO: not idle for prod.
    });
  }

  private async startIndexer() {
    const address = FieldElement.fromBigInt(BigInt(ARGENT_PROXY_CLASS_HASH));

    //filter accounts created with Argents ClassHash
    const filter = Filter.create()
      .withHeader({ weak: true })
      .addTransaction((tx) => tx.deployAccount().withClassHash(address))
      .encode();

    const client = new StreamClient({
      url: env.apibara.dnaClient,
      clientOptions: {
        'grpc.max_receive_message_length': 128 * 1_048_576,
      },
      token: env.apibara.token,
    });

    client.configure({
      filter,
      batchSize: 1,
      finality: v1alpha2.DataFinality.DATA_STATUS_ACCEPTED,
    });

    for await (const message of client) {
      this.logger.log('message received');
      if (message.message === 'data') {
        const { data } = message.data;

        for (const item of data) {
          const block = starknet.Block.decode(Buffer.from(item));

          for (const { transaction, receipt } of block.transactions) {
            const hash = transaction?.meta?.hash;
            if (!receipt.events || !hash) {
              continue;
            }

            const targetEvent = receipt.events.find(
              (event) => String(event?.index) === '1',
            );

            if (targetEvent) {
              const ownerAddress = FieldElement.toBigInt(targetEvent.data[0]);
              const guardianAddress = FieldElement.toBigInt(
                targetEvent.data[1],
              );

              const transactionHash = FieldElement.toHex(hash);

              // this.logger.log('Transaction Details:');
              // this.logger.log(`Owner: 0x${ownerAddress.toString(16)}`);
              // this.logger.log(`Guardian: 0x${guardianAddress.toString(16)}`);
              // this.logger.log(`Transaction Hash: ${transactionHash}`);

              await this.accountsService.create({
                ownerAddress: validateAndParseAddress(
                  `0x${ownerAddress.toString(16)}`,
                ),
                guardianAddress: validateAndParseAddress(
                  `0x${guardianAddress.toString(16)}`,
                ),
                transactionHash: transactionHash,
                BlockNumber: Number(block.header.blockNumber),
                createdAt: new Date(
                  parseInt(String(block.header.timestamp.seconds)) * 1000,
                ),
              });
              this.logger.log('Account event saved');
            }
          }
        }
      }
    }
  }
}
