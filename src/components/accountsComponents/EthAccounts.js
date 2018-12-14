import React, { Component } from 'react';
import withRoot from '../../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Save from '@material-ui/icons/Save';

// Redux state
import { connect } from "react-redux";
import { NETWORKS } from "../../store/accountsActions";

// Custom Components
import EtherscanLogo from '../helpers/EtherscanLogo'
import NewEthAccountDialog from './NewEthAccountDialog'

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

class EthAccounts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open_new_account_dialog: false,
      saving: false
    };
  }

  handleClick_AddEthAccount = async () => {
    this.setState({
      open_new_account_dialog: true
    })
  }

  handleClose_AddEthAccount = () => {
    this.setState({
      open_new_account_dialog: false
    })
  }

  // Encrypt wallet data with user's password
  saveAccount = async (new_account_index) => {
    let identityToAssociateWithAccount = this.props.username
    let new_account = (
      new_account_index < this.props.eth_accounts.length 
      ? this.props.eth_accounts[new_account_index] 
      : null)
    let password = this.props.password
    let chainId = '0' // ETH = 0, EOS = 1

    if (identityToAssociateWithAccount && new_account) {
      
      // Encrypt json wallet
      try {
        this.setState({
          saving: true
        })

        // Set up body of API request
        let encrypted_json = await createEncryptedWallet(password, new_account)
        let address_from_encrypted_json = getJsonAddress(encrypted_json)

        let save_data_result = await saveAccountToUser(
          identityToAssociateWithAccount, 
          password,
          chainId,
          address_from_encrypted_json,
          encrypted_json
        )
        console.log('React now can use this data: ', save_data_result)
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
      eth_accounts,
      username
    } = this.props;
    const {
      open_new_account_dialog,
      saving
    } = this.state

    return (
        <Paper className={classes.paper} elevation={3}>
              <Typography variant="body1" className={classes.section}> 
                  <b>Eth Wallets</b>: 
              </Typography>
              {/* Add Eth Accounts */}
              <Button 
                variant="contained" 
                onClick={this.handleClick_AddEthAccount}
                disabled={false}
              >
                New
              </Button>
              {/* View Eth Accounts */}
              { eth_accounts.length > 0 ? (
              <div>
                {eth_accounts.map((account, i) => {
                  return (<Typography key={i}> 
                    <EtherscanLogo /> ({i}): 
                    <a
                      href={"https://ropsten.etherscan.io/address/" + account.address}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" view account"}
                    </a>
                    {username && (
                      <Button
                        onClick={() => this.saveAccount(i)}
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
                    )}
                  </Typography>)
                })}
              </div> ) : ("")}
              <NewEthAccountDialog 
                open={open_new_account_dialog} 
                onCloseHandler={this.handleClose_AddEthAccount} 
                network={NETWORKS.ETH}
              />
        </Paper >
    )
  }
}

EthAccounts.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapState, mapDispatch)(withRoot(withStyles(styles)(EthAccounts)));
