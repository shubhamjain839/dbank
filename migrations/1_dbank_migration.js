/* eslint-disable no-undef */
const DBank = artifacts.require('DBank')

module.exports = function (deployer) {
  deployer.deploy(DBank)
}
