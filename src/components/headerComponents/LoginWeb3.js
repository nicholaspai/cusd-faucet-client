import React, { Component } from 'react';
import withRoot from '../../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// WEB3 Services
import { signMessage } from '../../eth_services/signMessage'
import { recoverMessageSigner } from '../../eth_services/recoverMessageSigner'

// EOS services
import {Api} from 'eosjs';
import { rpc, EOS_NETWORK, rpcMainnet, EOS_NETWORK_MAINNET } from '../../eos_services/getDefaultEosJS'
import { rpcTelos, TELOS_NETWORK } from '../../telos_services/getDefaultEosJS'
import { rpcOre, ORE_NETWORK } from '../../ore_services/getDefaultEosJS'

// Redux state
import { connect } from "react-redux";
import { ethActions } from "../../store/ethActions";
import { eosActions } from "../../store/eosActions";
import { telosActions } from "../../store/telosActions";
import { oreActions } from "../../store/oreActions";
import { globalActions, PAGES } from "../../store/globalActions";
import { tronActions } from "../../store/tronActions"
import SelectAccountEthereum from "./SelectAccountEthereum"

const styles = theme => ({
});
 
const mapState = state => ({
  network: state.global.network,
  web3: state.global.web3,
  eth_accounts: state.accounts.eth_accounts,
  tronWeb: state.global.tronWeb,
  scatter_state: state.eos.scatter_state,
  page: state.global.page
})

const mapDispatch = dispatch => ({
  setEthAddress: address => dispatch(ethActions.setEthAddress(address)),
  setEthWallet: wallet => dispatch(ethActions.setEthWallet(wallet)),
  setTronAddress: address => dispatch(tronActions.setTronAddress(address)),
  setEOS:  client => dispatch(globalActions.setEOS(client)),
  setEosName: name => dispatch(eosActions.setEosName(name)),
  setEosNetwork: network => dispatch(eosActions.setEosNetwork(network)),
  setTELOS:  client => dispatch(globalActions.setTELOS(client)),
  setTelosName: name => dispatch(telosActions.setTelosName(name)),
  setTelosNetwork: network => dispatch(telosActions.setTelosNetwork(network)),
  setORE:  client => dispatch(globalActions.setORE(client)),
  setOreName: name => dispatch(oreActions.setOreName(name)),
  setOreNetwork: network => dispatch(oreActions.setOreNetwork(network)),
  setScatterState: string => dispatch(eosActions.setScatterState(string)),
});

class LoginWeb3 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signing_in: false,
      anchorEl: null,
      openSelectDialog: false
    };
  }

  /** ASK USER TO SELECT LOGIN METHOD FOR ETHEREUM */
  handleClick_LoginMenu_Ethereum = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  /** DETECT IF USER IS LOGGED IN TO TRON */
  handleClick_LoginMenu_Tron = () => {
    if (!this.props.tronWeb) {
      alert('Switch to a Tron dApp browser to use this faucet for the time being, apologies!')
      return
    }
    let loggedIn = this.props.tronWeb.ready
    if (loggedIn && this.props.tronWeb.defaultAddress) {
      this.props.setTronAddress(this.props.tronWeb.defaultAddress)
    } else {
      alert('You are connected to Tron, but we cannot detect your address! Please login to your Tron wallet to use this faucet-- if you are on desktop then try installing the TronLink browser extension')
    }
  }

  /** Request user's EOS identity through Scatter */
  // TODO: Need to find a way to refactor these methods, but need to be able to pass in a param to an onClick handler in the DOM
  handleClick_LoginMenu_Eos = async () => {
    if (!this.props.scatter_state) { return; }
    if (this.props.scatter_state.identity) {
      // User already signed in, forget their previous identity
      await this.props.scatter_state.logout()
    } 
    
    // Now, request user to connect their identity for app usage
    // After a user has approved giving you permission to access their Identity you no longer have to call getIdentity() if the user refreshes the page. 
    // Instead you can check if an Identity exists on the scatter object itself. 
    // This also means that you don't have to save the Identity within your shared 
    // services along-side your Scatter reference, 
    // you can simply save your Scatter reference and 
    // pull the identity from within it.
    //
    // n.b. this is the reason why we call logout() on each button press to allow user to switch their identity
    const NETWORK = EOS_NETWORK
    let identity = await this.props.scatter_state.login({ accounts: [NETWORK]})
    if (!identity) { return console.error(`No Scatter identity found on this network`)}

    const account = this.props.scatter_state.identity.accounts.find(x => x.blockchain === 'eos');
    if (account && account.name) {
      // Create eosJS client object
      const RPC = rpc
      const eos = this.props.scatter_state.eos(NETWORK, Api, {rpc:RPC, beta3:true})
      this.props.setEOS(eos)
      const NETWORK_NAME = "jungle"
      this.props.setEosNetwork(NETWORK_NAME)
      // Save user's account name (full account details are in account)
      this.props.setEosName(account.name)
    }
  }
  /** Request user's EOS identity through Scatter */
  // TODO: Need to find a way to refactor these methods, but need to be able to pass in a param to an onClick handler in the DOM
  handleClick_LoginMenu_Telos = async () => {
    if (!this.props.scatter_state) { return; }
    if (this.props.scatter_state.identity) {
      // User already signed in, forget their previous identity
      await this.props.scatter_state.logout()
    } 
    
    // Now, request user to connect their identity for app usage
    // After a user has approved giving you permission to access their Identity you no longer have to call getIdentity() if the user refreshes the page. 
    // Instead you can check if an Identity exists on the scatter object itself. 
    // This also means that you don't have to save the Identity within your shared 
    // services along-side your Scatter reference, 
    // you can simply save your Scatter reference and 
    // pull the identity from within it.
    //
    // n.b. this is the reason why we call logout() on each button press to allow user to switch their identity
    const NETWORK = TELOS_NETWORK
    let identity = await this.props.scatter_state.login({ accounts: [NETWORK]})
    if (!identity) { return console.error(`No Scatter identity found on this network`)}

    const account = this.props.scatter_state.identity.accounts.find(x => x.blockchain === 'eos');
    if (account && account.name) {
      // Create eosJS client object
      const RPC = rpcTelos
      const telos = this.props.scatter_state.eos(NETWORK, Api, {rpc:RPC, beta3:true})
      this.props.setTELOS(telos)
      const NETWORK_NAME = "testnet"
      this.props.setTelosNetwork(NETWORK_NAME)
      // Save user's account name (full account details are in account)
      this.props.setTelosName(account.name)
    }
  }
  /** Request user's EOS identity through Scatter */
  // TODO: Need to find a way to refactor these methods, but need to be able to pass in a param to an onClick handler in the DOM
  handleClick_LoginMenu_Ore = async () => {
    if (!this.props.scatter_state) { return; }
    if (this.props.scatter_state.identity) {
      // User already signed in, forget their previous identity
      await this.props.scatter_state.logout()
    } 
    
    // Now, request user to connect their identity for app usage
    // After a user has approved giving you permission to access their Identity you no longer have to call getIdentity() if the user refreshes the page. 
    // Instead you can check if an Identity exists on the scatter object itself. 
    // This also means that you don't have to save the Identity within your shared 
    // services along-side your Scatter reference, 
    // you can simply save your Scatter reference and 
    // pull the identity from within it.
    //
    // n.b. this is the reason why we call logout() on each button press to allow user to switch their identity
    const NETWORK = ORE_NETWORK
    let identity = await this.props.scatter_state.login({ accounts: [NETWORK]})
    if (!identity) { return console.error(`No Scatter identity found on this network`)}

    const account = this.props.scatter_state.identity.accounts.find(x => x.blockchain === 'eos');
    if (account && account.name) {
      // Create eosJS client object
      const RPC = rpcOre
      const ore = this.props.scatter_state.eos(NETWORK, Api, {rpc:RPC, beta3:true})
      this.props.setORE(ore)
      const NETWORK_NAME = "staging"
      this.props.setOreNetwork(NETWORK_NAME)
      // Save user's account name (full account details are in account)
      this.props.setOreName(account.name)
    }
  }
  handleClick_LoginMenu_Eos_Mainnet = async () => {
    if (!this.props.scatter_state) { return; }
    if (this.props.scatter_state.identity) {
      // User already signed in, forget their previous identity
      await this.props.scatter_state.logout()
    } 
    
    // Now, request user to connect their identity for app usage
    // After a user has approved giving you permission to access their Identity you no longer have to call getIdentity() if the user refreshes the page. 
    // Instead you can check if an Identity exists on the scatter object itself. 
    // This also means that you don't have to save the Identity within your shared 
    // services along-side your Scatter reference, 
    // you can simply save your Scatter reference and 
    // pull the identity from within it.
    //
    // n.b. this is the reason why we call logout() on each button press to allow user to switch their identity
    const NETWORK = EOS_NETWORK_MAINNET
    let identity = await this.props.scatter_state.login({ accounts: [NETWORK]})
    if (!identity) { return console.error(`No Scatter identity found on this network`)}

    const account = this.props.scatter_state.identity.accounts.find(x => x.blockchain === 'eos');
    if (account && account.name) {
      // Create eosJS client object
      const RPC = rpcMainnet
      const eos = this.props.scatter_state.eos(EOS_NETWORK_MAINNET, Api, {rpc:RPC, beta3:true})
      this.props.setEOS(eos)
      const NETWORK_NAME = "mainnet"
      this.props.setEosNetwork(NETWORK_NAME)
      // Save user's account name (full account details are in account)
      this.props.setEosName(account.name)
    }
  }
  
  /** 
      Ethereum Login Handlers:
      There are multiple choices for connecting to the Ethereum network
   */
  // Ask user to authenticate their keypair
  loginMetaMask = async () => {
    this.setState({
      signing_in: true
    })
    this.handleClose()
    
    let web3 = this.props.web3
    if ( !web3 ) {
      // No web3 injected
      alert('we cannot detect your web3, sorry')
      this.setState({
        signing_in: false
      })
      return
    }
    try {
      let accounts = await web3.eth.getAccounts()
      let user = accounts[0]

      let messageToSign = "I am cryptographically signing this message" 

      let sig = await signMessage(web3, messageToSign, user)
      let signer = await recoverMessageSigner(
        window.web3,
        messageToSign,
        sig
      )
      this.props.setEthAddress(signer)
      this.props.setEthWallet('') // FIXME: !Only a Carbon account should have a signer-wallet via ethers.js!
      this.setState({
        signing_in: false
      })
    } catch (err) {
      alert('if you do not have an Ethereum account, get a free burner account at "Accounts"')
      console.error('signature failed')
      this.setState({
        signing_in: false
      })
    }
  }

  // Ask user to select a Carbon wallet (created in Accounts page)
  loginCarbonWallet = () => {
    this.handleClose()
    if ( this.props.eth_accounts.length > 0 ) {
        this.setState({
            openSelectDialog: true
        })
    }
    else {
        alert('No accounts detected')
    }
  }

  // Clear user address
  logout = () => {
      this.props.setEthAddress('')
      this.props.setEthWallet('')
      this.handleClose()
  }  

  /** ALWAYS CALL HANDLECLOSE() AFTER EACH LOGIN HANDLER */
  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  /** HANDLER FOR CLOSING SELECT DIALOG */
  closeSelectDialog = () => {
      this.setState({
          openSelectDialog: false
      })
  }

  render() {
    const { anchorEl, openSelectDialog } = this.state;
    const { network, page } = this.props;
    return (
        <div>
          { page === PAGES.MAIN && network === 0 ? 
            <Button
                aria-owns={anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
                onClick={this.handleClick_LoginMenu_Ethereum}
                disabled={this.state.signing_in}
                variant="contained"
                color="primary"
            >
                Sign In to Ethereum
            </Button>
            :""}
          { page === PAGES.MAIN && network === 1 ? 
            <Button
                aria-owns={anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
                onClick={this.handleClick_LoginMenu_Eos}
                disabled={this.state.signing_in}
                variant="contained"
                color="primary"
            >
                Sign In to EOS
            </Button>
            :""}
          { page === PAGES.MAIN && network === 3 ? 
            <Button
                aria-owns={anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
                onClick={this.handleClick_LoginMenu_Telos}
                disabled={this.state.signing_in}
                variant="contained"
                color="primary"
            >
                Sign In to TELOS
            </Button>
            :""}
          { page === PAGES.MAIN && network === 4 ? 
            <Button
                aria-owns={anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
                onClick={this.handleClick_LoginMenu_Ore}
                disabled={this.state.signing_in}
                variant="contained"
                color="primary"
            >
                Sign In to ORE
            </Button>
            :""}
          { page === PAGES.MAIN && network === 2 ? 
            <Button
                onClick={this.handleClick_LoginMenu_Tron}
                variant="contained"
                color="primary"
            >
                Sign In to Tron
            </Button>
            :""}
          { page === PAGES.SWAP ? (
            <Button
                aria-owns={anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
                onClick={this.handleClick_LoginMenu_Eos_Mainnet}
                disabled={this.state.signing_in}
                variant="contained"
                color="primary"
            >
                Sign In to EOS Mainnet
            </Button>
          ):""}
            {/* Ethereum Login options */}
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}
            >
                <MenuItem onClick={this.loginMetaMask}>Injected Web3</MenuItem>
                <MenuItem onClick={this.loginCarbonWallet}>Temporary Accounts</MenuItem>
                <MenuItem onClick={this.logout}>Logout</MenuItem>
            </Menu>
            <SelectAccountEthereum open={openSelectDialog} onCloseHandler={this.closeSelectDialog}/>
        </div>
    );
  }
}

LoginWeb3.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(mapState, mapDispatch)(withRoot(withStyles(styles)(LoginWeb3)));
