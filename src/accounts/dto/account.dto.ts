import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AccountDto {
  @Field()
  ownerAddress: string;

  @Field()
  guardianAddress: string;

  @Field()
  transactionHash: string;

  @Field()
  BlockNumber: number;

  @Field()
  createdAt: Date;
}
