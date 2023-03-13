import {
  generateHDPrivateKey,
  getAddressByPrivateKey,
  getFaucetPoolAddr,
  getFaucetPoolKey,
} from './utils'

const { TEST_PRIV_KEY, TEST_ADDR } = process.env

describe('Test utils', () => {
  it('Check enviroments', () => {
    expect(process.env.TEST_PRIV_KEY).not.toBeUndefined()
    expect(process.env.TEST_ADDR).not.toBeUndefined()
    expect(getFaucetPoolKey()).not.toBeUndefined()
    expect(getFaucetPoolAddr()).not.toBeUndefined()
  })

  it('Should create a wallet account', () => {
    const pk = generateHDPrivateKey()
    expect(pk).toMatch(/^0x([0-9a-fA-F][0-9a-fA-F])*$/)
  })

  it('Should get a testnet address by the private key', () => {
    const addr = getAddressByPrivateKey(TEST_PRIV_KEY!)
    expect(addr).toBe(TEST_ADDR)
  })

  it.skip('Should check CKB balance', async () => {
    // const c = await getCapacities(TEST_ADDR)
    // const expectedCapacities = BI.from(10000)
    // expect(c.eq(10000)).is
    // expect(c.eq(expectedCapacities)).toBe(true)
  })
})
