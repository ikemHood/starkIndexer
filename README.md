Deployed At => https://starkindexer.onrender.com

# StarkIndexer

## Starknet Argent Account Indexer API Documentation

## Introduction

This Indexer uses ApiBara to Index Argent accounts on starknet and provides endpoints to query the account data using GraphQL. The endpoints allow you to retrieve accounts based on various criteria, including pagination, guardian address, and owner address.

## Prerequisites

- Node.js (version 16.x or later)
- NestJS CLI installed globally (`npm install -g @nestjs/cli`)
- MongoDB connection string
- Yarn or npm as the package manager

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ikemHood/starkIndexer.git
   cd starkIndexer
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```
   or if you prefer npm:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory of the project and add necessary environment variables as shown in `.env.example`.


## Starting the Application

To start the application in development mode:

```bash
yarn start:dev
```
or with npm:

```bash
npm run start:dev
```

The application will be available at `http://localhost:3000/graphql` by default.

## GraphQL API Usage

### Query: Get All Accounts

This query retrieves a list of accounts, with optional pagination.

**Query Example**:
```graphql
query {
  getAccounts(skip: 0, limit: 10) {
    ownerAddress
    guardianAddress
    transactionHash
    BlockNumber
    createdAt
  }
}
```

**Parameters**:
- `skip` (optional): The number of records to skip. Default is `0`.
- `limit` (optional): The number of records to return. Default is `10`.

**Response Example**:
```json
{
  "data": {
    "getAccounts": [
      {
        "ownerAddress": "0x123...",
        "guardianAddress": "0x456...",
        "transactionHash": "0x789...",
        "BlockNumber": 123456,
        "createdAt": "2024-08-13T12:34:56Z"
      },
      ...
    ]
  }
}
```

### Query: Get Account by Guardian Address

This query retrieves a single account by its guardian address.

**Query Example**:
```graphql
query {
  getAccountByGuardian(guardianAddress: "0x456...") {
    ownerAddress
    guardianAddress
    transactionHash
    BlockNumber
    createdAt
  }
}
```

**Parameters**:
- `guardianAddress` (required): The guardian address of the account.

**Response Example**:
```json
{
  "data": {
    "getAccountByGuardian": {
      "ownerAddress": "0x123...",
      "guardianAddress": "0x456...",
      "transactionHash": "0x789...",
      "BlockNumber": 123456,
      "createdAt": "2024-08-13T12:34:56Z"
    }
  }
}
```

### Query: Get Account by Owner Address

This query retrieves a single account by its owner address.

**Query Example**:
```graphql
query {
  getAccountByAddress(ownerAddress: "0x123...") {
    ownerAddress
    guardianAddress
    transactionHash
    BlockNumber
    createdAt
  }
}
```

**Parameters**:
- `ownerAddress` (required): The owner address of the account.

**Response Example**:
```json
{
  "data": {
    "getAccountByAddress": {
      "ownerAddress": "0x123...",
      "guardianAddress": "0x456...",
      "transactionHash": "0x789...",
      "BlockNumber": 123456,
      "createdAt": "2024-08-13T12:34:56Z"
    }
  }
}
```
