import React, { Component } from 'react';
import './App.css';
import withRoot from './withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField'

// WEB3 Services
import Web3 from 'web3';
import { sendCUSD } from './services/sendCUSD'

// REST API server
import axios from 'axios'
const MINT_ENDPOINT = "https://cusd-faucet-server-ropsten.herokuapp.com/api/faucet/minter"
const TRANSFER_ENDPOINT = "https://cusd-faucet-server-ropsten.herokuapp.com/api/faucet/relayer"

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  main: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 5,
  },
  paper: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 1,
    marginLeft: theme.spacing.unit * 5,
    marginRight: theme.spacing.unit * 5,
  },
  grow: {
    flexGrow: 1,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

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
      transferring: false,
      pendingTransfer: [],
      amount_to_transfer: '',
      transfer_to: ''
    };
  }

  /** WEB3 RELATED SERVICE FUNCTIONS */
  
  // Detect or set window.web3 ethereum connection
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

  // Fetch active CUSD instance
  getCusd = () => {
    let web3 = window.web3
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

  // Refresh user CUSD balance
  updateUserBalance = async (user) => {
    if (window.web3 && user) {
      let cusd = this.getCusd()
      if (window.web3.utils.isAddress(user)) {
        let balance = await cusd.methods.balanceOf(user).call()
        let short_balance = window.web3.utils.fromWei(balance.toString(), 'ether')
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

  // Request user to cryptographically sign a message
  signMessage = (dataToSign, from) => {
    return new Promise((resolve, reject) =>
      window.web3.eth.personal.sign(
        dataToSign,
        from,
        (err, signature) => {
          if (err) return reject(err);
          return resolve(signature);
        }
      )
    );
  };

  // Get user who signed a message
  getUserFromSignature = async (
      message,
      signature
  ) => {
      let user = await window.web3.eth.accounts.recover(
        message, signature
      )
      return user
  }

  /** CONTINUOUS TIMER BEGINNING AT MOUNT */
  componentDidMount = async () => {
    // Request user's web3 connection
    await this.setWindowWeb3() 

    var intervalId = setInterval(this.timer, 1000);
    // store intervalId in the state so it can be accessed later:
    this.setState({intervalId: intervalId});
  }

  // @dev Put anything that you want to continually compute here
  timer = async () => {
    // Update signMessageuser balance
    await this.updateUserBalance(this.state.user_address)
  }

  componentWillUnmount = () => {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }
  
  /** BUTTON CLICK HANDLERS */

  // Refresh user balance in state
  handleClick_Balance = async () => {
    if (this.state.user_address) {
      await this.updateUserBalance(this.state.user_address)
    } else {
      return
    }
  }

  // Mint new CUSD to user
  handleClick_Mint = async () => {
    if (window.web3) {
      let web3 = window.web3
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
          MINT_ENDPOINT
        )
        let minter_balance = minter_status.minter_balance
        if (minter_balance <= 0) {
          alert('Minter does not have enough eth to mint :(')
          this.setState({
            minting: false
          })
        }
        let response = await axios.post(
          MINT_ENDPOINT,
          post_data
        );

        console.log(response)

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

  // Ask user to authenticate their keypair
  handleClick_Login = async () => {
    this.setState({
      signing_in: true
    })
    
    if ( window.web3 ) {
      let web3 = window.web3

      try {
        let accounts = await web3.eth.getAccounts()
        let user = accounts[0]

        let messageToSign = "Welcome to the Carbon CUSD faucet! Please sign this message to verify that you are who you say you are, and we'll mint you " 
                            + this.state.amount_to_mint 
                            + " CUSD."
        let sig = await this.signMessage(messageToSign, user)
        let signer = await this.getUserFromSignature(
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

   // Transfer CUSD to another user
  handleClick_Transfer = async () => {
    if (window.web3) {
      let web3 = window.web3
      let amountToTransfer = web3.utils.toWei(this.state.amount_to_transfer, 'ether')
  
      let from = this.state.user_address
      let to = this.state.transfer_to
      if (!web3.utils.isAddress(to)) {
        console.log('invalid user address: (to) ', to)
        return
      }
      if (!web3.utils.isAddress(from)) {
        console.log('invalid user address: (from) ', from)
        return
      }

      let post_data = {
        amount: amountToTransfer.toString(),
        user: to
      }

      this.setState({
        transferring: true
      })

      try {
        // TODO: Each pending transfer should have a Number:transfer_id, and a status: pending, failed, success
        let relayer_status = await axios.get(
          TRANSFER_ENDPOINT
        )
        console.log(relayer_status)
        let relayer_balance = relayer_status.balance_relayer
        if (relayer_balance <= 0) {
          alert('Relayer does not have enough eth to forward metatransfer :(')
          this.setState({
            minting: false
          })
        }

        alert('Please sign the transfer metatransaction, and we will pay for your ETH gas fees to send CUSD!')
        await sendCUSD(web3, from, to, amountToTransfer)


        // let response = await axios.post(
        //   TRANSFER_ENDPOINT,
        //   post_data
        // );

        // console.log(response)

        // let pending_hash = response.data.pending_hash
        // this.setState({
        //   pendingTransfer: this.state.pendingTransfer.concat([pending_hash]),
        //   transferring: false
        // })
      } catch (err) {
        this.setState({
          transferring: false
        })
      }
    }
  }

  /** END BUTTON CLICK HANDLERS */


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

    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Ropsten Faucet <span role="img" aria-label="Sake">🍶</span>
            </Typography>
            {/* REQUEST USER SIGNATURE */}
            <Button
              onClick={this.handleClick_Login}
              disabled={this.state.signing_in}
              variant="contained"
              color="primary"
            >
              Sign In to Ethereum
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.main}>
          {/* USER IDENTITY  */}
          <Paper className={classes.paper} elevation={3}>
            <Typography> 
              You are connected to Ethereum as: 
                  {this.state.user_address ? (<a
                    href={"https://ropsten.etherscan.io/address/" + this.state.user_address}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user_short}...
                  </a>) : ("")}
            </Typography>
          </Paper>
          {/* MINT */}
          <Paper className={classes.paper} elevation={3}>
            {/* MINT NEW CUSD  */}
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
            {/* MINT TXNS  */}
            { this.state.pendingMint.length > 0 ? (
            <div>
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
            </div> ) : ("")}
          </Paper>
          {/* USER BALANCES  */}
          <Paper className={classes.paper} elevation={3}>
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
          {/* TRANSFER */}
          <Paper className={classes.paper} elevation={3}>
            {/* TRANSFER CUSD  */}
              { !this.state.user_address ?
              (
                <Button disabled>Please sign in trade CUSD!</Button>
              )
              : (
                <div>
                <form>
                  <TextField
                    id="transfer-to"
                    label="Transfer To"
                    className={classes.textField}
                    value={this.state.transfer_to}
                    onChange={this.handleChange('transfer_to')}
                    margin="normal"
                  />
                  <TextField
                    id="transfer-amount"
                    label="Amount"
                    type="number"
                    className={classes.textField}
                    value={this.state.amount_to_transfer}
                    onChange={this.handleChange('amount_to_transfer')}
                    margin="normal"
                  />
                </form>
                <Button
                  onClick={this.handleClick_Transfer}
                  disabled={
                    this.state.transferring ||
                    !this.state.transfer_to ||
                    isNaN(this.state.amount_to_transfer) ||
                    this.state.amount_to_transfer <= 0
                  }
                  variant="contained"
                  color="secondary"
                >
                  Transfer {this.state.amount_to_transfer ? this.state.amount_to_transfer : ""} CUSD
                </Button>
                </div>
              )
              }
            {/* TRANSFER TXNS  */}
            { this.state.pendingTransfer.length > 0 ? (
            <div>
              <Typography> 
                Your transfer transactions: 
              </Typography>
              {this.state.pendingTransfer.map((pending_hash, i) => {
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
            </div> ) : ("")}
          </Paper>

        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(App));
