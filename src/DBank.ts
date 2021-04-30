import web3 from './web3'
import { AbiItem } from 'web3-utils'
import { abi } from './contracts/DBank.json'
import { dbank } from './DeployedAddress.json'

const DBankContract = new web3.eth.Contract(abi as AbiItem[], dbank.prod)

export default DBankContract
