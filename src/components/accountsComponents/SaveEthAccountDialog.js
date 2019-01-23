import React, { Component } from 'react';
import withRoot from '../../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Save from '@material-ui/icons/Save';

// Redux state
import { connect } from "react-redux";
import { NETWORKS } from "../../store/accountsActions";

// Wallet management helpers
import createEncryptedWallet from '../../eth_services/encryptAccount'
import getJsonAddress from '../../eth_services/getJsonAddress'
import saveAccountToUser from '../../db_services/saveAccountToUser'

const styles = theme => ({
  paper: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 1,
    marginLeft: theme.spacing.unit * 5,
    marginRight: theme.spacing.unit * 5,
  },
  section: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    textAlign: 'left'
  },
  facebook2: {
    color: '#6798e5',
    animationDuration: '550ms',
    position: 'absolute',
  },
});

// Redux mappings
const mapState = state => ({
  eth_accounts: state.accounts.eth_accounts,
  username: state.global.username,
  password: state.global.password
});

const mapDispatch = dispatch => ({
});

class SaveEthAccountDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open_new_account_dialog: false,
      saving: false
    };
  }
  // Encrypt wallet data with user's password
  saveAccount = async (new_account_index) => {
    let identityToAssociateWithAccount = this.props.username
    let new_account = (
      new_account_index < this.props.eth_accounts.length 
      ? this.props.eth_accounts[new_account_index] 
      : null)
    let password = this.props.password
    let chainId = NETWORKS.ETH 

    if (identityToAssociateWithAccount && new_account) {
      
      // Encrypt json wallet
      try {
        this.setState({
          saving: true
        })

        // Set up body of API request
        let encrypted_json = await createEncryptedWallet(password, new_account)
        let address_from_encrypted_json = getJsonAddress(encrypted_json)

        let saved_wallet = await saveAccountToUser(
          identityToAssociateWithAccount, 
          password,
          chainId,
          address_from_encrypted_json,
          encrypted_json
        )

        if (saved_wallet) {
            // Successfully saved account
            let wallet_key = saved_wallet.wallet_key

            console.log('saved wallet to user (' + identityToAssociateWithAccount + '): ' + wallet_key)
        } 

        this.setState({
          saving: false
        })

  
      } catch (err) {
        console.log('ERROR: could not save wallet data')
        this.setState({
          saving: false
        })
        return
      }

    } else {
      alert('cannot save to this account')
      return
    }
  }

  render() {

    const { 
      classes,
      account_index
    } = this.props;
    const {
      saving
    } = this.state

    return (      
        <Button
          onClick={() => this.saveAccount(account_index)}
        >
          {saving ? 
          (<CircularProgress
              variant="indeterminate"
              disableShrink
              className={classes.facebook2}
              size={24}
              thickness={4}
          />) : 
          (
            <Save />
          )}
        </Button>         
    )
  }
}

SaveEthAccountDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  account_index: PropTypes.number.isRequired
};

export default connect(mapState, mapDispatch)(withRoot(withStyles(styles)(SaveEthAccountDialog)));
