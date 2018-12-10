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
import { burnCUSD } from './services/burnCUSD'
import { updateUserBalance } from './services/updateUserBalance'
import { signMessage } from './services/signMessage'
import { recoverMessageSigner } from './services/recoverMessageSigner'

// REST API server
import axios from 'axios'
const SERVER= 'http://localhost:5000/'
// const SERVER = "https://cusd-faucet-server-ropsten.herokuapp.com/"
const MINTER_ENDPOINT = SERVER+"api/faucet/minter"
const RELAYER_ENDPOINT = SERVER+"api/faucet/relayer"

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
      updating_balance: false,
      transferring: false,
      pendingTransfer: [],
      amount_to_transfer: '',
      transfer_to: '',
      burning: false,
      pendingBurn: [],
      amount_to_burn: ''
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

  // Refresh user CUSD balance
  _updateUserBalance = async (web3, user) => {
    if (!web3 || !user) return;
    let short_balance = await updateUserBalance(web3, user)
    if (short_balance >= 0 ) {
      this.setState({
        balance_cusd: short_balance
      })
    }
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
    // Update user balance
    await this._updateUserBalance(window.web3, this.state.user_address)
  }

  componentWillUnmount = () => {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }
  
  /** BUTTON CLICK HANDLERS */

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
          MINTER_ENDPOINT
        )
        let minter_balance = minter_status.minter_balance
        if (minter_balance <= 0) {
          alert('Minter does not have enough eth to mint :(')
          this.setState({
            minting: false
          })
        }
        let response = await axios.post(
          MINTER_ENDPOINT,
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
        let sig = await signMessage(window.web3, messageToSign, user)
        let signer = await recoverMessageSigner(
          window.web3,
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

      this.setState({
        transferring: true
      })

      try {
        // TODO: Each pending transfer should have a Number:transfer_id, and a status: pending, failed, success
        let relayer_status = await axios.get(
          RELAYER_ENDPOINT
        )
        let relayer_balance = relayer_status.balance_relayer
        if (relayer_balance <= 0) {
          alert('Relayer does not have enough eth to forward metatransfer :(')
          this.setState({
            minting: false
          })
        }

        alert('Please sign the transfer metatransaction, and we will pay for your ETH gas fees to send CUSD!')
        let post_data = await sendCUSD(web3, from, to, amountToTransfer)
        // console.log('metatransfer: ', post_data)

        let response = await axios.post(
          RELAYER_ENDPOINT,
          post_data
        );

        let pending_hash = response.data.hash
        this.setState({
          pendingTransfer: this.state.pendingTransfer.concat([pending_hash]),
          transferring: false
        })
      } catch (err) {
        this.setState({
          transferring: false
        })
      }
    }
  }

  // Redeem CUSD by burning
  handleClick_Burn = async () => {
    if (window.web3) {
      let web3 = window.web3
      let amountToBurn = web3.utils.toWei(this.state.amount_to_burn, 'ether')
  
      let from = this.state.user_address
      if (!web3.utils.isAddress(from)) {
        console.log('invalid user address: (from) ', from)
        return
      }

      this.setState({
        burning: true
      })

      try {
        // TODO: Each pending burn should have a Number:burn_id, and a status: pending, failed, success
        let relayer_status = await axios.get(
          RELAYER_ENDPOINT
        )
        let relayer_balance = relayer_status.balance_relayer
        if (relayer_balance <= 0) {
          alert('Relayer does not have enough eth to forward metatransfer :(')
          this.setState({
            burning: false
          })
        }

        alert('Please sign the burn metatransaction, and we will pay for your ETH gas fees to redeem CUSD!')
        let post_data = await burnCUSD(web3, from, amountToBurn)

        let response = await axios.post(
          RELAYER_ENDPOINT,
          post_data
        );
        
        let pending_hash = response.data.hash
        this.setState({
          pendingBurn: this.state.pendingBurn.concat([pending_hash]),
          burning: false
        })

      } catch (err) {
        this.setState({
          burning: false
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
          {/* BURN */}
          <Paper className={classes.paper} elevation={3}>
            {/* BURN CUSD  */}
              { !this.state.user_address ?
              (
                <Button disabled>Please sign in redeem CUSD!</Button>
              )
              : (
                <div>
                <form>
                  <TextField
                    id="burn-amount"
                    label="Amount"
                    type="number"
                    className={classes.textField}
                    value={this.state.amount_to_burn}
                    onChange={this.handleChange('amount_to_burn')}
                    margin="normal"
                  />
                </form>
                <Button
                  onClick={this.handleClick_Burn}
                  disabled={
                    this.state.burning ||
                    isNaN(this.state.amount_to_burn) ||
                    this.state.amount_to_burn <= 0
                  }
                  variant="contained"
                  color="secondary"
                >
                  Redeem {this.state.amount_to_burn ? this.state.amount_to_burn : ""} CUSD
                </Button>
                </div>
              )
              }
            {/* BURN TXNS  */}
            { this.state.pendingBurn.length > 0 ? (
            <div>
              <Typography> 
                Your burn transactions: 
              </Typography>
              {this.state.pendingBurn.map((pending_hash, i) => {
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
