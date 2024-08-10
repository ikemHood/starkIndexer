import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('app');
        expect(typeof res.body.app).toBe('string');
      });
  });

  describe('GraphQL', () => {
    it('should query accounts', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              getAccounts(skip: 0, limit: 10) {
                ownerAddress
                guardianAddress
                transactionHash
                BlockNumber
                createdAt
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(Array.isArray(res.body.data.getAccounts)).toBe(true);
        });
    });

    it('should query account by guardian', () => {
      const guardianAddress = '0x123456789abcdef';
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              getAccountByGuardian(guardianAddress: "${guardianAddress}") {
                ownerAddress
                guardianAddress
                transactionHash
                BlockNumber
                createdAt
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          if (res.body.data.getAccountByGuardian) {
            expect(res.body.data.getAccountByGuardian.guardianAddress).toBe(
              guardianAddress,
            );
          }
        });
    });

    it('should query account by owner', () => {
      const ownerAddress = '0x987654321fedcba';
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              getAccountByAddress(ownerAddress: "${ownerAddress}") {
                ownerAddress
                guardianAddress
                transactionHash
                BlockNumber
                createdAt
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          if (res.body.data.getAccountByAddress) {
            expect(res.body.data.getAccountByAddress.ownerAddress).toBe(
              ownerAddress,
            );
          }
        });
    });
  });
});
