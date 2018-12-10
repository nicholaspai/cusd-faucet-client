import React, { Component } from 'react';
import './App.css';

// Material-ui
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import axios from 'axios'
import Web3 from 'web3';

// Config
import config from './config';
import path from 'path';
const SERVER_DOMAIN = (config.env === 'development') ? 
  'http://localhost:5000' : 
  'https://cusd-faucet-server-ropsten.herokuapp.com'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_address: '',
      signing_in: false,
      amount_to_mint: "10.3141",
      minting: false,
      pendingMint: [],
      balance_cusd: '',
    };
  }

  // Extract web3 instance from injected web3
  getWeb3 = (window_web3) => {
    var _web3 = new Web3(window_web3.currentProvider)
    return _web3
  }


  setWindowWeb3 = async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.enable();
        } catch (error) {
            // User denied account access...
            console.log('user denied ethereum account access')
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
        alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  // Get user who signed a message
  getUserFromSignature = async (
      web3,
      message,
      signature
  ) => {
      let user = await web3.eth.accounts.recover(
        message, signature
      )
      return user
  }

  handleClick_Login = async () => {
    this.setState({
      signing_in: true
    })
    
    if ( window.web3 ) {
      let web3 = this.getWeb3(window.web3)
      let network = (await web3.eth.net.getId()).toString()

      // Users must be on Ropsten
      if (network !== "3") {
        alert('No network detected, please switch to the Ropsten test net!')
        this.setState({
          signing_in: false
        })
        return
      }

      try {
        let accounts = await web3.eth.getAccounts()
        let user = accounts[0]

        let messageToSign = "Welcome to the Carbon CUSD faucet! Please sign this message to verify that you are who you say you are, and we'll mint you " 
                            + this.state.amount_to_mint 
                            + " CUSD."
        let sig = await this.signTransaction(web3, messageToSign, user)
        let signer = await this.getUserFromSignature(
          web3,
          messageToSign,
          sig
        )
        this.setState({
          user_address: signer,
          signing_in: false
        })
      } catch (err) {
        console.error('user could not sign message')
        this.setState({
          signing_in: false
        })
      }
    } else {
      // No web3 injected
      alert('Cannot connect to Ethereum, are you using a dapp-enabled browser?')
      this.setState({
        signing_in: false
      })
      return
    }
  }

  signTransaction = (web3, dataToSign, from) => {
    return new Promise((resolve, reject) =>
      web3.eth.personal.sign(
        dataToSign,
        from,
        (err, signature) => {
          if (err) return reject(err);
          return resolve(signature);
        }
      )
    );
  };

  getCusd = web3 => {
    // Contract ABI's
    const ABI = require("./contracts/MetaToken.json");

    // Contract Ropsten Addresses
    const ADDRESS = "0x67450c8908e2701abfa6745be3949ad32acf42d8";

    var jsonFile = ABI;
    var abi = jsonFile.abi;
    var deployedAddress = ADDRESS;
    const instance = new web3.eth.Contract(abi, deployedAddress);
    return instance;
  }

  updateUserBalance = async (user) => {
    if (window.web3 && user) {
      let web3 = this.getWeb3(window.web3)
      let cusd = this.getCusd(web3)
      if (web3.utils.isAddress(user)) {
        let balance = await cusd.methods.balanceOf(user).call()
        let short_balance = web3.utils.fromWei(balance.toString(), 'ether')
        this.setState({
          balance_cusd: short_balance
        })
        return short_balance
      } else {
        return -1
      }
    } else {
      return -1
    }
  }

  // @dev Put anything that you want to continually compute here
  timer = async () => {
    // Update user balance
    this.updateUserBalance(this.state.user_address)
  }

  componentDidMount = async () => {
    // await this.setWindowWeb3() // Request user's web3 connection
    var intervalId = setInterval(this.timer, 1000);
    // store intervalId in the state so it can be accessed later:
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount = () => {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }

  
  handleClick_Mint = async () => {
    if (window.web3) {
      let web3 = this.getWeb3(window.web3)
      let amountToMint = web3.utils.toWei(this.state.amount_to_mint, 'ether')

      let to = this.state.user_address
      if (!web3.utils.isAddress(to)) {
        console.log('invalid user address: ', to)
        return
      }

      let post_data = {
        amount: amountToMint.toString(),
        user: to
      }

      this.setState({
        minting: true
      })

      try {
        // TODO: Each pending mint should have a Number:mint_id, and a status: pending, failed, success
        let minter_status = await axios.get(
          path.join(SERVER_DOMAIN, 'api/faucet/minter')
        )
        let minter_balance = minter_status.minter_balance
        if (minter_balance <= 0) {
          alert('Minter does not have enough eth to mint :(')
          this.setState({
            minting: false
          })
        }
        let response = await axios.post(
          path.join(SERVER_DOMAIN, "/api/faucet/minter"),
          post_data
        );

        let pending_hash = response.data.pending_hash
        this.setState({
          pendingMint: this.state.pendingMint.concat([pending_hash]),
          minting: false
        })
      } catch (err) {
        this.setState({
          minting: false
        })
      }
    }
  }

  handleClick_Balance = () => {
    if (this.state.user_address) {
      this.updateUserBalance(this.state.user_address)
    } else {
      return
    }
  }
  
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {

    const etherscan = (
      <img
        style={{ height: "20px", width: "auto" }}
        alt="Etherscan"
        src="https://db5islsn2p9x4.cloudfront.net/etherscan.png"
      />
    );

    const user_short = this.state.user_address ? this.state.user_address.substring(0, 8) : "" 

    return (
      <div className="App">
        {/* USER IDENTITY  */}
        <Paper elevation={5}>
          <Typography> 
            You are connected to Ethereum as: {user_short}...
          </Typography>
        </Paper>
        {/* REQUEST USER SIGNATURE */}
        <Paper elevation={4}>
          <Button
            onClick={this.handleClick_Login}
            disabled={this.state.signing_in}
            variant="contained"
            color="primary"
          >
            Sign In to Ethereum
          </Button>
        </Paper>
        {/* MINT */}
        <Paper elevation={3}>
          {/* MINT NEW CUSD  */}
          <Paper elevation={1}>
            { !this.state.user_address ?
            (
              <Button disabled>Please sign in get CUSD!</Button>
            )
            : (
              <Button
                onClick={this.handleClick_Mint}
                disabled={this.state.minting}
                variant="contained"
                color="secondary"
              >
                Mint me {this.state.amount_to_mint} CUSD
              </Button>
            )
            }
          </Paper>
          {/* MINT TXNS  */}
          { this.state.pendingMint.length > 0 ? (
          <Paper elevation={1}>
            <Typography> 
              Your mint transactions: 
            </Typography>
            {this.state.pendingMint.map((pending_hash, i) => {
              return (<Typography key={i}> 
                {etherscan} ({i}): 
                <a
                  href={"https://ropsten.etherscan.io/tx/" + pending_hash}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" track on Etherscan"}
                </a>
              </Typography>)
            })}
          </Paper> ) : ("")}
        </Paper>
        {/* USER BALANCES  */}
        <Paper elevation={5}>
          <Button
            onClick={this.handleClick_Balance}
            disabled={!this.state.user_address}
            color="secondary"
            variant="contained">
            Refresh Balance
          </Button>
          <Typography> 
            Your CUSD balance: {this.state.balance_cusd}
          </Typography>
        </Paper>
      </div>
    );
  }
}

export default App;
