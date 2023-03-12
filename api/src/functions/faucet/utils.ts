import { config, hd, helpers } from '@ckb-lumos/lumos'

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

export function isUndefined(obj: unknown): boolean {
  return obj === void 0
}
