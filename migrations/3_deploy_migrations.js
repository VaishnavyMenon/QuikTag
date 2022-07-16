
const ProductAuthenticator = artifacts.require("ProductAuthenticator");




module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(ProductAuthenticator)
};