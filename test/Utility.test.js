/* eslint-disable no-undef */
const Utility = artifacts.require('Utility')

contract('Utility', (accounts) => {
  it('is deployed', async () => {
    const instance = await Utility.deployed()
    const address = await instance.address
    assert(address)
  })
  it('Can produce random number', async () => {
    const instance = await Utility.deployed()
    const number = await instance.getRandomNumber({ from: accounts[0] })
    assert(number)
  })
})
