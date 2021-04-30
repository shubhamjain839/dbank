/* eslint-disable no-undef */
const LuckyDraw = artifacts.require('LuckyDraw')
const Utility = artifacts.require('Utility')

const ENTRY_VALUE = '1000000000000000000'
const GAS = '3000000'

contract('Lucky Draw', (accounts) => {
  it('is deployed', async () => {
    const instance = await LuckyDraw.deployed()
    const address = await instance.address
    assert(address)
  })
  it('manager is present', async () => {
    const instance = await LuckyDraw.deployed()
    const manager = await instance.manager()
    assert.ok(manager === accounts[0])
  })
  it('manager can set the util contract address', async () => {
    const address = Utility.address
    const instance = await LuckyDraw.deployed()
    await instance.setUtilityAddress(address, {
      from: accounts[0],
      gas: GAS,
    })
  })
  it('can participate to lottery', async () => {
    const instance = await LuckyDraw.deployed()
    await instance.participate({
      from: accounts[1],
      value: ENTRY_VALUE,
    })
  })
  it('can pick a winner', async () => {
    const address = Utility.address
    const instance = await LuckyDraw.deployed()

    await instance.setUtilityAddress(address, {
      from: accounts[0],
      gas: GAS,
    })
    await instance.participate({
      from: accounts[1],
      value: ENTRY_VALUE,
    })
    await instance.participate({
      from: accounts[2],
      value: ENTRY_VALUE,
    })
    await instance.participate({
      from: accounts[3],
      value: ENTRY_VALUE,
    })
    await instance.pickWinner({
      from: accounts[0],
      gas: GAS,
    })
  })
})
