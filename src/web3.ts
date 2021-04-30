import Web3 from 'web3'

// Use this provider for development environment

import HDWalletProvider from '@truffle/hdwallet-provider'
import { mnemonics, address } from './ProviderConfig.json'
const provider = new HDWalletProvider(mnemonics.dev, address.dev)

//@ts-ignore
const web3 = new Web3(window.ethereum)

export default web3
