import React, { Component } from 'react';
import withRoot from '../../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

// Redux state
import { connect } from "react-redux";
import { NETWORKS } from "../../store/accountsActions";

// Custom Components
import EtherscanLogo from '../helpers/EtherscanLogo'
import NewEthAccountDialog from './NewEthAccountDialog'
import SaveEthAccountDialog from './SaveEthAccountDialog'

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

  render() {

    const { 
      classes, 
      eth_accounts,
      username
    } = this.props;
    const {
      open_new_account_dialog,
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
                    {/* save ETH account to signed in user */}
                    {username && (
                      <SaveEthAccountDialog account_index={i}/>
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
