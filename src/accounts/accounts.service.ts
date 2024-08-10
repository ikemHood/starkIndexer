import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) {}

  async create(accountData: Partial<Account>): Promise<Account> {
    const createdAccount = await this.accountModel.create(accountData);
    return createdAccount.save();
  }

  async findAll(skip = 0, limit = 10): Promise<Account[]> {
    return this.accountModel.find().skip(skip).limit(limit).exec();
  }

  async findByGuardian(guardianAddress: string): Promise<Account | null> {
    return this.accountModel.findOne({ guardianAddress }).exec();
  }

  async findByOwner(ownerAddress: string): Promise<Account | null> {
    return this.accountModel.findOne({ ownerAddress }).exec();
  }
}
