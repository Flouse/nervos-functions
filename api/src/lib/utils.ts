import { config, hd, helpers, HexString } from '@ckb-lumos/lumos'

config.initializeConfig(config.predefined.AGGRON4)

export const generateHDPrivateKey = () => {
  const { mnemonic, ExtendedPrivateKey, AddressType } = hd
  const myMnemonic = mnemonic.generateMnemonic()
  const seed = mnemonic.mnemonicToSeedSync(myMnemonic)

  const extendedPrivKey = ExtendedPrivateKey.fromSeed(seed)
  return extendedPrivKey.privateKeyInfo(AddressType.Receiving, 0).privateKey
}

export const getAddressByPrivateKey = (privateKey: string) => {
  const args = hd.key.privateKeyToBlake160(privateKey)
  const template = config.predefined.AGGRON4.SCRIPTS['SECP256K1_BLAKE160']
  const lockScript = {
    codeHash: template.CODE_HASH,
    hashType: template.HASH_TYPE,
    args: args,
  }

  return helpers.encodeToAddress(lockScript)
}

/**
 * @returns The unit of the result is shannon.
 */
// export async function getCapacities(address: string): Promise<BI> {
//   const collector = indexer.collector({
//     lock: helpers.parseAddress(address),
//   })

//   let capacities = BI.from(0)
//   for await (const cell of collector.collect()) {
//     capacities = capacities.add(cell.cellOutput.capacity)
//   }

//   return capacities
// }

export const isUndefined = (obj: unknown): boolean => {
  return obj === void 0
}

export const getFaucetPoolKey = (): HexString => {
  const { FAUCET_POOL_KEY } = process.env
  if (FAUCET_POOL_KEY === undefined)
    throw new Error(`missing env.FAUCET_POOL_KEY`)
  return FAUCET_POOL_KEY
}

export const getFaucetPoolAddr = (): string => {
  const { FAUCET_POOL_ADDR } = process.env
  if (FAUCET_POOL_ADDR === undefined)
    throw new Error(`missing env.FAUCET_POOL_ADDR`)
  return FAUCET_POOL_ADDR
}
