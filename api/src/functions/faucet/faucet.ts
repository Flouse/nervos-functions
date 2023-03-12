import { parseAddress } from '@ckb-lumos/helpers'
import {
  hd,
  config,
  RPC,
  Indexer,
  helpers,
  commons,
  HexString,
  Script,
  Cell,
} from '@ckb-lumos/lumos'
import type { APIGatewayEvent, Context } from 'aws-lambda'

import { logger } from 'src/lib/logger'

import { isUndefined } from './utils'

// This faucet feature is based on CKB testnet.
// Explorer: https://pudge.explorer.nervos.org
config.initializeConfig(config.predefined.AGGRON4)

// CKB testnet public Node RPC with builtin indexer
const CKB_RPC_URL = 'https://testnet.ckb.dev/rpc'
export const rpc = new RPC(CKB_RPC_URL)
export const indexer = new Indexer(CKB_RPC_URL)

/**
 * The handler function is your code that processes http request events.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations} 
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation, function, and execution
 *                              environment.
 * @returns a response or error for the request
 */
export const handler = async (event: APIGatewayEvent, _context: Context) => {
  // TODO: better log
  logger.info(`${event.httpMethod} ${event.path}: faucet function`)

  let statusCode = 200
  let message = ''

  // call facet function
  try {
    const { target_ckt_address: toAddr } = event.queryStringParameters

    const txHash = await faucet(toAddr)
    message = `A faucet transaction(${txHash}) was sent.
    Its status could be viewed in https://pudge.explorer.nervos.org/transaction/${txHash}`
    logger.info(message)

    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_hash: txHash,
        message,
      }),
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      message = err.message
    } else if (typeof err === 'string') {
      message = err
    }

    return {
      statusCode: statusCode === 200 ? 500 : statusCode,
      body: {
        message,
      },
    }
  }
}

/**
 * Transfer 10 cells to the receiver, with 100CKB in every cell
 * @param toAddr ToAddress: the faucet receiver's address
 * @returns the hash of the faucet transaction
 *
 * TODO: facet with sudt?
 */
export const faucet = async (toAddr: HexString) => {
  const { FAUCET_POOL_KEY, FAUCET_POOL_ADDR } = process.env
  if (isUndefined(FAUCET_POOL_ADDR) || isUndefined(FAUCET_POOL_KEY)) {
    // TODO
  }

  let txSkeleton = await constructFaucetTransaction(toAddr)

  // sign the transation
  const { prepareSigningEntries } = commons.common
  txSkeleton = prepareSigningEntries(txSkeleton)
  const message = txSkeleton.get('signingEntries').get(0)?.message
  const Sig = hd.key.signRecoverable(message!, FAUCET_POOL_KEY)
  const tx = helpers.sealTransaction(txSkeleton, [Sig])

  // send the transaction, null and passthrough mean skipping outputs validation
  const txHash = await rpc.sendTransaction(tx, 'passthrough')

  return txHash
}

export const constructFaucetTransaction = async (toAddr: HexString) => {
  const senderAddr: commons.FromInfo = process.env.FAUCET_POOL_ADDR!
  const cellNum = 10
  const outputCapacity = BigInt(100 * 10 ** 8) // shannons

  const { transfer, payFeeByFeeRate } = commons.common
  let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer })
  txSkeleton = await transfer(
    txSkeleton,
    [senderAddr],
    toAddr,
    outputCapacity * BigInt(cellNum),
  )

  // split targetOutput into `cellNum` cells
  txSkeleton = txSkeleton.update('outputs', (outputs) => {
    const toScript: Script = parseAddress(toAddr)
    const targetOutput: Cell | undefined = outputs.find((o) => {
      const {
        cellOutput: { lock },
      } = o

      // eslint-disable-next-line prettier/prettier
      return lock.codeHash === toScript.codeHash && lock.hashType === toScript.hashType
    })

    if (targetOutput === undefined) throw new Error('targetOutput not found')

    targetOutput.cellOutput.capacity = '0x' + outputCapacity.toString(16)
    const newCells = []
    for (let i = 1; i < cellNum; i++) {
      const clonedOutput: Cell = JSON.parse(JSON.stringify(targetOutput));
      newCells.push(clonedOutput)
    }

    return outputs.unshift(...newCells)
  })

  txSkeleton = await payFeeByFeeRate(txSkeleton, [senderAddr], 1000)

  logger.debug(JSON.stringify(txSkeleton))
  return txSkeleton
}
