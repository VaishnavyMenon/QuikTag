import { Tab, Tabs, Button, Card, Badge } from 'react-bootstrap'
// import exchange from '../logo.png'
import React, { Component } from 'react';
import ProductAuthenticator from '../abis/ProductAuthenticator.json'
import Web3 from 'web3';
import './App.css';
import { QrReader } from 'react-qr-reader';



const { TabPane } = Tabs;
// const web3 
// = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))
class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      productAuthenticator: null,
      productID: null,
      productBrand: null,
      productModel: null,
      productDetails: [],
      name: null,
      location: null,
      phone: null,
      paResponse: [],
      balance: 0,
      accounts: [],
      button: "outline-success",
      scanResultWebCam: null
    }
  }
  handleErrorWebCam(error) {
    console.log(error);
  }
  handleScanWebCam(result) {
    if (result) {
      console.log(result)
      this.setState({ productID: result });
    }
  }

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }
  componentDidMount() {
    // this.interval = setInterval(() => { this.rand(); this.setState({ time: Date.now() }) }, 1000);
  }

  // async componentDidUpdate(prevProps, prevState) {
  //   if (
  //     this.state.accounts[0] !==
  //     prevState.accounts[0]
  //   ) {
  //     if (this.state.productAuthenticator !== 'undefined') {

  //       var res = await this.state.productAuthenticator.methods.fetchUserDetails().call({ from: this.state.accounts[0] });
  //       console.log(res)
  //       this.setState({ userType: res })
  //     }
  //   }
  // }


  componentWillUnmount() {
    // clearInterval(this.interval);

  }
  async loadBlockchainData(dispatch) {
    // if (typeof ethereum !== 'undefined') {
    if (window.ethereum) {
      let currentProvider = window.ethereum
      const a = await currentProvider.request({ method: 'eth_requestAccounts' })
      const web3 = new Web3(window.ethereum)
      // const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))
      const netId = await web3.eth.net.getId()
      const accounts = await web3.eth.getAccounts()
      console.log(accounts)
      //load balance
      if (typeof accounts[0] !== 'undefined') {
        const balance = await web3.eth.getBalance(accounts[0])

        this.setState({ account: accounts[0], accounts: accounts, balance: balance, web3: web3 })
      } else {
        window.alert('Please login with MetaMask')
      }

      //load contracts
      try {
        const productAuthenticator = new web3.eth.Contract(ProductAuthenticator.abi, ProductAuthenticator.networks[netId].address)
        console.log("ProductAuthenticator", productAuthenticator)
        this.setState({ productAuthenticator: productAuthenticator });
        if (this.state.productAuthenticator !== 'undefined') {
          var res = await this.state.productAuthenticator.methods.fetchUserDetails().call({ from: this.state.accounts[0] });
          console.log(res)
          this.setState({ userType: res })
        }

      } catch (e) {
        console.log('Error', e)
        window.alert('Contracts not deployed to the current network')
      }

    } else {
      // wndow.alert
      // ('Please install MetaMask')
      Web3 = new Web3(
        new Web3.providers.HttpProvider("http://127.0.0.1:8545"),

      );
    }

  }

  async addProduct() {
    if (this.state.productAuthenticator !== 'undefined') {
      try {
        var res = await this.state.productAuthenticator.methods.addProduct(this.state.productID, this.state.productBrand, this.state.productModel).send({ from: this.state.accounts[0], gas: 5000000 });
        if (res.events?.IsAdded) {
          console.log(res.events.IsAdded)
          this.setState({ paResponse: [res.events.IsAdded.returnValues[0], res.events.IsAdded.returnValues[1]] })
          console.log(this.state.paResponse)
        }
      } catch (e) {
        console.log('Error, deposit: ', e)
      }
    }
  }
  async addCustomer() {
    if (this.state.productAuthenticator !== 'undefined') {
      try {
        var res = await this.state.productAuthenticator.methods.addCustomer(this.state.name, this.state.phone).send({ from: this.state.accounts[0], gas: 5000000 });
        if (res.events?.IsAdded) {
          console.log(res.events.IsAdded)
          this.setState({ paResponse: [res.events.IsAdded.returnValues[0], res.events.IsAdded.returnValues[1]] })
          console.log(this.state.paResponse)
        }
      } catch (e) {
        console.log('Error, deposit: ', e)
      }
    }
  }
  async addRetailer() {
    if (this.state.productAuthenticator !== 'undefined') {
      try {
        let res = await this.state.productAuthenticator.methods.addRetailer(this.state.name, this.state.location).send({ from: this.state.accounts[0], gas: 5000000 });
        if (res.events?.IsAdded) {
          console.log(res.events.IsAdded)
          this.setState({ paResponse: [res.events.IsAdded.returnValues[0], res.events.IsAdded.returnValues[1]] })
          console.log(this.state.paResponse)
        }
      } catch (e) {
        console.log('Error, deposit: ', e)
      }
    }
  }
  async getProduct() {
    if (this.state.productAuthenticator !== 'undefined') {
      try {
        let res = await this.state.productAuthenticator.methods.getProduct(this.state.productID).send({ from: this.state.accounts[0], gas: 5000000 });
        this.setState({ productDetails: res.events.ProductDetails.returnValues })
        console.log(res.events.ProductDetails.returnValues)
      } catch (e) {
        console.log('Error, deposit: ', e)
      }
    }
  }
  async checkOwnerShip() {
    if (this.state.productAuthenticator !== 'undefined') {
      try {
        let res = await this.state.productAuthenticator.methods.checkOwnership(this.state.productID).call({ from: this.state.accounts[0] });
        console.log(res)
        // if (res) {
        this.setState({ paResponse: [res.toString()] })
        console.log(this.state.paResponse)
        // }
      } catch (e) {
        console.log('Error, deposit: ', e)
      }
    }
  }
  async payOff(e) {
    e.preventDefault()
    if (this.state.productAuthenticator !== 'undefined') {

    }
  }
  changeTab() {
    this.setState({ paResponse: [], productDetails: [], productID: null })
  }
 
  render() {
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          {/* <img src={exchange} className="App-logo" alt="logo" height="32"/> */}
          <b style={{ color: "white" }}>Product Authenticator</b>
        </nav>
        <div className="container-fluid mt-5 text-center">
          <br></br>
          <h1>Welcome to QuikTag</h1>
          <div>
            <br></br>
          <h5><b>Address: </b>{console.log(this.state.account)} {this.state.account}<br></br><b>User: </b>{this.state.userType}</h5>
        
          
          <br></br>
          </div>
          {/* {this.state.userType !== "User Not Found" && */}
          <Tabs style={{fontSize:'17px', fontFamily:"Verdana",  paddinng:"30px"}} defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3" onClick={() => this.changeTab()}>
           <br></br>
            {<Tab style={{}} eventKey="Add Customer" title="Add Customer">
              <div>
                
                <b><div style={{ fontSize:"27px", padding: "5px", fontFamily: "Verdana", color:"green", textAlign:"left"}}>ADD CUSTOMER</div></b>
                

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    let amount = this.depositAmount.value
                    // amount = amount * 10**18 //convert to wei
                    this.addProduct()
                  }}
                >
                  <div className='form-group mr-sm-2'>
                    <br></br>
                    <input style={{width:"1100px",height:"50px"}}
                      id='name'
                      className="form-control form-control-md"
                      placeholder='Name'
                      onChange={(e) => {
                        this.setState({ name: e.target.value })
                        console.log("Name", this.state.name)
                      }}
                      required />
                      <br></br>
                    <input style={{width:"1100px",height:"50px"}}
                      id='Phone'
                      className="form-control form-control-md"
                      placeholder='Phone'
                      onChange={(e) => {
                        this.setState({ phone: e.target.value })
                        console.log("phone", this.state.phone)
                      }}
                      required />
                  </div>
                  <br></br>
                  <Button className="click" style={{backgroundColor:"green",color:"white",border: '2px solid',borderRadius: '6px', width:"200px",height:"45px", fontSize:"20px", float:"left"}} variant="outline-success" onClick={() => { this.addCustomer() }}>ADD CUSTOMER</Button>{' '}
                  <br></br><br></br><br></br>
                  <div style={{color:"Black", float:"left",fontSize:"20px"}} variant="success">{this.state.paResponse}</div>{' '}
                </form>

              </div>
            </Tab>}
            <Tab eventKey="Add Retailer" title="Add Retailer">
              <div>
              
                <b><div style={{ fontSize:"27px", padding: "5px", fontFamily: "Verdana", color:"green", textAlign:"left"}}>ADD RETAILER</div></b>
              

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    let amount = this.depositAmount.value
                    // amount = amount * 10**18 //convert to wei
                    this.addRetailer()
                  }}
                >
                  <div className='form-group mr-sm-2'>
                    <br></br>
                    <input style={{width:"1100px",height:"50px"}}
                      id='Name'
                      className="form-control form-control-md"
                      placeholder='Name'
                      onChange={(e) => {
                        this.setState({ name: e.target.value })
                        console.log("Name", this.state.name)
                      }}
                      required />
                      <br></br>
                    <input style={{width:"1100px",height:"50px"}}
                      id='location'
                      className="form-control form-control-md"
                      placeholder='Location'
                      onChange={(e) => {
                        this.setState({ location: e.target.value })
                        console.log("location", this.state.location)
                      }}
                      required />
                  </div>
                  <br></br>
                  <Button  style={{backgroundColor:"green",color:"white",border: '2px solid',borderRadius: '6px', width:"200px",height:"45px", fontSize:"20px", float:"left"}} variant="outline-success" onClick={() => { this.addRetailer() }}>ADD RETAILER</Button>{' '}
                  <br></br><br></br><br></br>
                  <div style={{color:"Black", float:"left",fontSize:"20px"}} variant="success">{this.state.paResponse}</div>{' '}
        

                </form>

              </div>
            </Tab>
            <Tab eventKey="scan" title="Scan" >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ width: '30%', height: "50px", }}>
                
                <b><div style={{ fontSize:"27px", padding: "5px", fontFamily: "Verdana", color:"green", textAlign:"left"}}>SCAN QR CODE</div></b>
                  <QrReader
                    onResult={(result, error) => {
                      if (!!result) {
                        this.handleScanWebCam(result?.text);
                      }
                      if (!!error) {

                        console.info(error);
                        this.handleErrorWebCam(error);
                      }
                    }}
                  // style={{ width: '50%',height:"50px" }}
                  /></div>
              </div>
              <br></br><br></br><br></br><br></br><br></br>
              <h4>Product ID: {this.state.productID}</h4><br />
              <Button style={{backgroundColor:"green",color:"white"}} variant="outline-success" onClick={() => { this.checkOwnerShip() }}>VERIFY OWNERSHIP</Button>{' '}
              <br></br><br></br>
              <div style={{fontSize:"20px"}}variant="success">{this.state.paResponse[0]}</div>{' '}
              <br></br>

            </Tab>
            <Tab eventKey="contact" title="Verify">
              <div>
              
                <b><div style={{ fontSize:"27px", padding: "5px", fontFamily: "Verdana", color:"green", textAlign:"left"}}>VERIFY OWNERSHIP</div></b>
              
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    let amount = this.depositAmount.value
                    // amount = amount * 10**18 //convert to wei
                    this.addProduct()
                  }}
                >
                  <div className='form-group mr-sm-2'>
                    <br></br>
                    <input style={{width:"1100px",height:"50px"}}
                      id='productId'
                      className="form-control form-control-md"
                      placeholder='Product ID'
                      onChange={(e) => {
                        this.setState({ productID: e.target.value })
                        console.log("productID", this.state.productID)
                      }}
                      required />

                  </div>
                  <br></br>
                  <Button style={{backgroundColor:"green",color:"white",border: '2px solid',borderRadius: '6px', width:"200px",height:"45px", fontSize:"20px", float:"left"}}variant="outline-success" onClick={() => { this.checkOwnerShip() }}>GET</Button>{' '}
                  <br></br>
                  <br></br><br></br>
                  <div style={{color:"Black", float:"left",fontSize:"20px"}} variant="success">{this.state.paResponse}</div>{' '}
                </form>

              </div>
            </Tab>
            <Tab eventKey="profile" title="Get">
              <div>
             
                <b><div style={{ fontSize:"27px", padding: "5px", fontFamily: "Verdana", color:"green", textAlign:"left"}}>GET PRODUCT DETAILS</div></b>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    let amount = this.depositAmount.value
                    // amount = amount * 10**18 //convert to wei
                    this.addProduct()
                  }}
                >
                  <div className='form-group mr-sm-2'>
                    <br></br>
                    <input style={{width:"1100px",height:"50px"}}
                      id='productId'
                      className="form-control form-control-md"
                      placeholder='Product ID'
                      onChange={(e) => {
                        this.setState({ productID: e.target.value })
                        console.log("productID", this.state.productID)
                      }}
                      required />
                  <br></br>
                  </div>
                  <Button style={{backgroundColor:"green",color:"white",border: '2px solid',borderRadius: '6px', width:"200px",height:"45px", fontSize:"20px", float:"left"}} variant="outline-success" onClick={() => { this.getProduct() }}>GET</Button>{' '}
                  <br></br><br></br><br></br>
                  {this.state.productDetails ?
                    <div style={{float:"left", align:"left"}}>
                      {this.state.productDetails[0]}<br />
                      {this.state.productDetails[1]}<br />
                      {this.state.productDetails[2]}<br />
                      {this.state.productDetails[3]}<br />
                      {this.state.productDetails[4]}<br />
          

                    </div> : null}
                </form>

              </div>
            </Tab>     
            <Tab eventKey="Add Product" title="Add">
              <div>
              
                <b><div style={{ fontSize:"27px", padding: "5px", fontFamily: "Verdana", color:"green", textAlign:"left"}}>ADD PRODUCT</div></b>
                

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    let amount = this.depositAmount.value
                    // amount = amount * 10**18 //convert to wei
                    this.addProduct()
                  }}
                >
                  <div className='form-group mr-sm-2'>
                    <br></br>
                    <input style={{width:"1100px",height:"50px"}}
                      id='productId'
                      className="form-control form-control-md"
                      placeholder='Product ID'
                      onChange={(e) => {
                        this.setState({ productID: e.target.value })
                        console.log("productID", this.state.productID)
                      }}
                      required />
                      <br></br>
                    <input style={{width:"1100px",height:"50px"}}
                      id='brand'
                      className="form-control form-control-md"
                      placeholder='Brand'
                      onChange={(e) => {
                        this.setState({ productBrand: e.target.value })
                        console.log("productID", this.state.productBrand)
                      }}
                      required />
                      <br></br>
        
                    <input style={{width:"1100px",height:"50px"}}
                      id='model'
                      className="form-control form-control-md"
                      placeholder='Model'
                      onChange={(e) => {
                        this.setState({ productModel: e.target.value })
                        console.log("productID", this.state.productModel)
                      }}
                      required />
                      <br></br>
                  </div>
                  <Button style={{backgroundColor:"green",color:"white",border: '2px solid',borderRadius: '6px', width:"200px",height:"45px", fontSize:"20px", float:"left"}} variant="outline-success" onClick={() => { this.addProduct() }}>ORDER</Button>{' '}
                  <br></br><br></br>
                  <div style={{color:"Black", float:"left",fontSize:"20px"}} variant="success">{this.state.paResponse[1]}</div>{' '}
                
                  {/* <Button variant="success">{this.state.
                    // paResponse[0]}</Button>{' '} */}
                </form>

              </div>
            </Tab>      
          </Tabs>
          {/* } */}
          <div className="row">
            {/* <main role="main" className="col-lg-12 d-flex text-center"> */}
            <div className="content mr-auto ml-auto">


              <br />
              {/* <div> <Button variant="outline-success" onClick={() => { this.issueTokens(this.state.depositedAmount) }}>ISSUE TOKENS</Button>{' '}</div><br /><br /> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
