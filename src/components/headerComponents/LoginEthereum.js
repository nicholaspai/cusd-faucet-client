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

// Redux state
import { connect } from "react-redux";
import { ethActions } from "../../store/ethActions";
import SelectAccountEthereum from "./SelectAccountEthereum"

const styles = theme => ({
});

const mapState = state => ({
  web3: state.global.web3,
  eth_accounts: state.accounts.eth_accounts,
})

const mapDispatch = dispatch => ({
  setEthAddress: address => dispatch(ethActions.setEthAddress(address)),
  setEthWallet: wallet => dispatch(ethActions.setEthWallet(wallet))
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

  /** ASK USER TO SELECT LOGIN METHOD */
  handleClick_LoginMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

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
    }
    try {
      let accounts = await web3.eth.getAccounts()
      let user = accounts[0]

      let messageToSign = "I am cryptograhically signing this message" 

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
    return (
        <div>
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
