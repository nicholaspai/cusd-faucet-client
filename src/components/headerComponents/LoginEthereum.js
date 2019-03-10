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
import { rpc, EOS_NETWORK } from '../../eos_services/getDefaultEosJS'

// Redux state
import { connect } from "react-redux";
import { ethActions } from "../../store/ethActions";
import { eosActions } from "../../store/eosActions";
import { globalActions } from "../../store/globalActions";
import { tronActions } from "../../store/tronActions"
import SelectAccountEthereum from "./SelectAccountEthereum"

const styles = theme => ({
});

const mapState = state => ({
  network: state.global.network,
  web3: state.global.web3,
  eth_accounts: state.accounts.eth_accounts,
  tronWeb: state.global.tronWeb,
  scatter_state: state.eos.scatter_state
})

const mapDispatch = dispatch => ({
  setEthAddress: address => dispatch(ethActions.setEthAddress(address)),
  setEthWallet: wallet => dispatch(ethActions.setEthWallet(wallet)),
  setTronAddress: address => dispatch(tronActions.setTronAddress(address)),
  setEOS:  client => dispatch(globalActions.setEOS(client)),
  setEosName: name => dispatch(eosActions.setEosName(name)),
  setScatterState: string => dispatch(eosActions.setScatterState(string)),
});

class LoginEthereum extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signing_in: false,
      anchorEl: null,
      openSelectDialog: false
    };
  }

  /** ASK USER TO SELECT LOGIN METHOD FOR ETHEREUM */
  handleClick_LoginMenu = event => {
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
    let identity = await this.props.scatter_state.login({ accounts: [EOS_NETWORK]})
    if (!identity) { return console.error(`No Scatter identity found on this network`)}

    const account = this.props.scatter_state.identity.accounts.find(x => x.blockchain === 'eos');
    if (account && account.name) {
      // Create eosJS client object
      const eos = this.props.scatter_state.eos(EOS_NETWORK, Api, {rpc, beta3:true})
      this.props.setEOS(eos)
      // Save user's account name (full account details are in account)
      this.props.setEosName(account.name)
    }
  }

  /** LOGIN HANDLERS */
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
    const { network } = this.props;
    return (
        
        <div>
          { network == 0 ? 
            <Button
                aria-owns={anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
                onClick={this.handleClick_LoginMenu}
                disabled={this.state.signing_in}
                variant="contained"
                color="primary"
            >
                Sign In to Ethereum
            </Button>
            :""}
          { network == 1 ? 
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
          { network == 2 ? 
            <Button
                onClick={this.handleClick_LoginMenu_Tron}
                variant="contained"
                color="primary"
            >
                Sign In to Tron
            </Button>
            :""}
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

LoginEthereum.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(mapState, mapDispatch)(withRoot(withStyles(styles)(LoginEthereum)));
