import web3 from './web3'
export interface IHash {
  payer: string
  reciver: string
  amount: string
  nonce: string
}

export const genrateHash = ({ payer, reciver, amount, nonce }: IHash) => {
  const hash = web3.utils.soliditySha3(payer, reciver, amount, nonce)
  return hash
}

export const signMessage = async (hash: IHash) => {
  const hashedMessage = genrateHash(hash)
  if (hashedMessage) {
    const signature = await web3.eth.sign(hashedMessage, hash.payer)
    return signature
  }
}
