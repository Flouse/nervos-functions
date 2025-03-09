import { mockHttpEvent } from '@redwoodjs/testing/api'

import { constructFaucetTransaction } from './faucet'
import { handler } from './faucet'

describe('faucet function', () => {
  it('Check enviroments', () => {
    expect(process.env.FAUCET_POOL_ADDR).not.toBeUndefined()
    expect(process.env.FAUCET_POOL_KEY).not.toBeUndefined()
  })

  it('Construct Transaction', async () => {
    const RECEIVER_ADDR =
      'ckt1qpuljza4azfdsrwjzdpea6442yfqadqhv7yzfu5zknlmtusm45hpuqgp69n8e0cuccx6jnqu7myulvnpuudkq3lhqqnal82l'
    const txSkeleton = await constructFaucetTransaction(RECEIVER_ADDR)

    expect(txSkeleton.get('outputs').size).toBeGreaterThanOrEqual(10)
  })

  it.skip('Successful faucet', async () => {
    const httpEvent = mockHttpEvent({
      queryStringParameters: {
        target_ckt_address:
          'ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqwa36p8tx5w82ekazwrk3dptfp5uwudq6q477q09',
      },
    })

    const response = await handler(httpEvent, null)
    const { message } = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(message).toMatch('A faucet transaction') // FIXME
  })

  it('Should not support wrong target_ckt_address', async () => {
    const httpEvent = mockHttpEvent({
      queryStringParameters: {
        target_ckt_address:
          'ckb1qpuljza4azfdsrwjzdpea6442yfqadqhv7yzfu5zknlmtusm45hpuqgp69n8e0cuccx6jnqu7myulvnpuudkq3lhqqnal82l',
      },
    })

    const response = await handler(httpEvent, null)
    expect(response.statusCode).toBe(500)
  })

  // You can also use scenarios to test your api functions
  // See guide here: https://redwoodjs.com/docs/testing#scenarios
  //
  // scenario('Scenario test', async () => {
  //
  // })
})

// Improve this test with help from the Redwood Testing Doc:
// https://redwoodjs.com/docs/testing#testing-functions
