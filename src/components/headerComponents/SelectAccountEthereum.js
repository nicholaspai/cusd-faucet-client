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
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress'

// Redux state
import { connect } from "react-redux";
import { ethActions } from "../../store/ethActions";

// Unlock an account with a password
import unlockAccountEth from '../../eth_services/unlockAccount'

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
    facebook2: {
        color: '#6798e5',
        animationDuration: '550ms',
        position: 'absolute',
        left: 0,
    },
});

const findJsonFromAddress = (address, array) => {
    for (var i = 0; i < array.length; i++) {
        if (array[i].address === address) {
            return array[i].json_encrypted
        }
    }
}

class SelectAccountEthereum extends React.Component {
  constructor(props) {
    super();

    this.state = {
      value: '',
      password: '',
      unlocking: false,
      password_error: false
    };
  }

  handleEntering = () => {
    this.radioGroupRef.focus();
  };

  signInToSelectedAccount = async () => {
    let selectedAddress = this.state.value
    let password = this.state.password
    let encryptedJson = findJsonFromAddress(selectedAddress, this.props.eth_accounts)

    try {
        this.setState({
            unlocking: true,
            password_error: false
        })
        let unlockedAccount = await unlockAccountEth(encryptedJson, password)
        this.setState({
            unlocking: false
        })
        // Save account, wallet, and close dialog
        let signer_wallet = createWalletFromUnlockedJson(unlockedAccount) 
        this.props.setEthWallet(signer_wallet)         
        this.props.setEthAddress(unlockedAccount.address) 
        this.props.onCloseHandler()
    } catch (err) {
        this.setState({
            unlocking: false,
            password_error: true
        })
        // Alert user that wrong password
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
        password,
        unlocking,
        password_error
    } = this.state
    const selectFormHelperText = (
        password_error ? 
        "incorrect password" : 
        "password for: " + value.substring(0,12)+ "..."
    )

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
          {value && (<TextField
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            type="password"
            onChange={this.handleChangeForm('password')}
            fullWidth
            helperText={selectFormHelperText}
          />)}
        </DialogContent>
        <DialogActions>
          { !unlocking && (<Button onClick={onCloseHandler} color="primary">
            Cancel
          </Button>) }
          { unlocking ?
            (<Button
                disabled
                color="primary"
            >
                <CircularProgress
                    variant="indeterminate"
                    disableShrink
                    className={classes.facebook2}
                    size={24}
                    thickness={4}
                />
            </Button>) 
            : 
            (<Button 
                onClick={this.signInToSelectedAccount} 
                disabled={!password}
                color="primary"
            >
                Unlock
            </Button>)
          }
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