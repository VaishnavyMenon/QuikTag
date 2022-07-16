const Todos = artifacts.require("Todos");
const ProductAuthenticator = artifacts.require("ProductAuthenticator");

contract("1st ProductAuthenticator test", async accounts => {
  it("ProductAuthenticator", async () => {
    // const instance = await Todos.deployed();
    const instance = await ProductAuthenticator.deployed();

    console.log("Inside")
    await instance.addProduct("10102","A Product","model2")
    const data = await instance.addProduct("10101","A Product","model")
    console.log(data.logs[0].args)
    const res = await instance.getProduct("10101")
    console.log("res",res.logs[0].args)
    let a = await instance.checkOwnership("10101");
    console.log("checkOwnership1",a)
    a = await instance.addCustomer("athul","9562");
    console.log("addCustomer",a.logs[0].args)
    // a = await instance.addRetailer("retailer","india");
    // console.log("addRetailer",a.logs[0].args)
    const re = await instance.getProduct("10101")
    console.log("re",re.logs[0].args)
    let b = await instance.getCustomerDetails()
    console.log("customer",b)
    b = await instance.getRetailerDetails()
    console.log("retailer",b)
    //   = await instance.getProduct("10101")
    // console.log("re",res.logs[0].args)
    // a = await instance.checkOwnership("10101").call(accounts[1]);
    // console.log("checkOwnership2:",a)
    // const balance = await instance.getBalance.call(accounts[0]);
    // assert.equal(balance.valueOf(), 10000);
  });
});