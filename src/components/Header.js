import React, { Component } from 'react';
import withRoot from '../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar';

// WEB3 Services
import { signMessage } from '../services/signMessage'
import { recoverMessageSigner } from '../services/recoverMessageSigner'

// Redux state
import { connect } from "react-redux";
import { ethActions } from "../store/ethActions";

// Custom Components
import HeaderMenu from './headerComponents/HeaderMenu'

const styles = theme => ({
  grow: {
    flexGrow: 1,
  },
});

const mapState = state => ({
  web3: state.global.web3
})

const mapDispatch = dispatch => ({
  setEthAddress: address => dispatch(ethActions.setEthAddress(address))
});

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signing_in: false,
    };
  }
  
  /** BUTTON CLICK HANDLERS */

  // Ask user to authenticate their keypair
  handleClick_Login = async () => {
    this.setState({
      signing_in: true
    })
    
    let web3 = this.props.web3
    if ( web3 ) {
      try {
        let accounts = await web3.eth.getAccounts()
        let user = accounts[0]

        let messageToSign = "Welcome to the Carbon CUSD faucet! Please sign this message to verify that you are who you say you are, and we'll mint you " 
                            + this.state.amount_to_mint 
                            + " CUSD."
        let sig = await signMessage(web3, messageToSign, user)
        let signer = await recoverMessageSigner(
          window.web3,
          messageToSign,
          sig
        )
        this.props.setEthAddress(signer)
        this.setState({
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

  /** END BUTTON CLICK HANDLERS */

  render() {
    const { classes } = this.props;

    return (
        <AppBar position="static">
          <Toolbar>
            <HeaderMenu />
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
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(mapState, mapDispatch)(withRoot(withStyles(styles)(Header)));
