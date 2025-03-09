# Nervos Functions

Welcome to Nervos Functions! This repo provides some handy functions for [Nervos Network](https://www.nervos.org).

By combining serverless computing with blockchain technology, several things can happen.

One of the major benefits is that it allows for the creation of decentralized applications that can be easily scaled and maintained. In a serverless blockchain architecture, code is run in stateless functions, making it easier to distribute the workload and manage resources. This can result in improved performance, reduced costs, and increased security.

Another benefit of combining serverless and blockchain is the ability to build smart contracts that can be executed automatically without the need for intermediaries or manual intervention. This can streamline and automate business processes, such as contract execution and payment processing, while ensuring transparency and security.

Overall, combining serverless and blockchain can lead to greater efficiency, scalability, automation, and security for decentralized applications and business processes.

It appears that you are looking for documentation on how to use a specific serverless API. Here is an example of how you might document the endpoint that you provided:

## TODO

- [ ] add API docs into the deployment

## Usage
API Endpoint: https://nervos-functions.vercel.app/api/${functionName}

### faucet

This endpoint allows users to request CKB testnet tokens, including 10 cells with 100 CKB in every cell

#### Request
Method: GET

Query Parameters:

`target_ckt_address` - the target CKB address to receive the test tokens (required)
#### Response

```json
Status Code: 200 OK
Body:
{
    "tx_hash": "<transaction hash>",
    "message": "A faucet transaction(<transaction hash>) was sent.\nIts status could be viewed in https://pudge.explorer.nervos.org/transaction/<transaction hash>"
}
```

## Environment Variables

Please create your own `.env` file to config FAUCET_POOL_KEY etc.

See [.env.defaults](./api/.env.defaults)

### Local Postgres Setup
One development database and one test database are required.
Read more about it in the testing doc's [The Test Database](https://redwoodjs.com/docs/testing#the-test-database) section.
```bash
cd api/db
docker-compose up -d
```
See https://redwoodjs.com/docs/local-postgres-setup#connect-to-postgres

## About [Redwoodjs](https://redwoodjs.com)

The best way to learn Redwood is by going through the comprehensive [tutorial](https://redwoodjs.com/docs/tutorial/foreword).
