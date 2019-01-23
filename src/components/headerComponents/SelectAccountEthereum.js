import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// Redux state
import { connect } from "react-redux";
import { ethActions } from "../../store/ethActions";

// Get wallet object capable of signing transactions from a decrypted wallet json
import createWalletFromUnlockedJson from '../../eth_services/createSignerWallet'

const mapState = state => ({
    eth_accounts: state.accounts.eth_accounts
})

const mapDispatch = dispatch => ({
    setEthAddress: address => dispatch(ethActions.setEthAddress(address)),
    setEthWallet: wallet => dispatch(ethActions.setEthWallet(wallet))
});

const styles = theme => ({
});

const findWalletFromAddress = (address, array) => {
    for (var i = 0; i < array.length; i++) {
        if (array[i].address === address) {
            return array[i]
        }
    }
}

class SelectAccountEthereum extends React.Component {
  constructor(props) {
    super();

    this.state = {
      value: '',
    };
  }

  handleEntering = () => {
    this.radioGroupRef.focus();
  };

  signInToSelectedAccount = async () => {
    let selectedAddress = this.state.value
    let wallet = findWalletFromAddress(selectedAddress, this.props.eth_accounts)
    let unlockedAccount = wallet

    try {
        // Save account, wallet, and close dialog
        let signer_wallet = createWalletFromUnlockedJson(unlockedAccount) 
        this.props.setEthWallet(signer_wallet)         
        this.props.setEthAddress(unlockedAccount.address) 
        this.props.onCloseHandler()
    } catch (err) {
        this.setState({
            unlocking: false,
        })
        console.error('ERROR: could not unlock account')
    }
  }

  handleChangeDialog = (event, value) => {
    this.setState({ value });
  };

  handleChangeForm = name => event => {
    this.setState({
        [name]: event.target.value,
    });
  };

  render() {
    const { 
        open, 
        classes,
        onCloseHandler,
        eth_accounts, 
        ...other } = this.props;
    const {
        value,
    } = this.state

    return (
      <Dialog
        onEntering={this.handleEntering}
        open={open}
        onClose={onCloseHandler}
        {...other}
      >
        <DialogTitle id="confirmation-dialog-title">Your Ethereum Accounts</DialogTitle>
        <DialogContent>
          <RadioGroup
            ref={ref => {
              this.radioGroupRef = ref;
            }}
            aria-label="Account"
            name="account_address"
            value={value}
            onChange={this.handleChangeDialog}
          >
            {eth_accounts.map(account => (
              <FormControlLabel value={account.address} key={account.address} control={<Radio />} label={account.address.substring(0,12)+"..."} />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCloseHandler} color="primary">
                Cancel
            </Button>
            <Button 
                onClick={this.signInToSelectedAccount} 
                color="primary"
            >
                Unlock
            </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

SelectAccountEthereum.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onCloseHandler: PropTypes.func.isRequired
  };
  
export default connect(mapState, mapDispatch)(withStyles(styles)(SelectAccountEthereum));