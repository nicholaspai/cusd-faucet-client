import React, { Component } from 'react';
import withRoot from '../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Clear from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';

// Redux state
import { connect } from "react-redux";
import { globalActions } from "../store/globalActions";

// Custom Components
import EthAccounts from './accountsComponents/EthAccounts'
import EosAccounts from './accountsComponents/EosAccounts'
import IdentityDialog from './accountsComponents/IdentityDialog'

const styles = theme => ({
  paper: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 1,
    marginLeft: theme.spacing.unit * 5,
    marginRight: theme.spacing.unit * 5,
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    textAlign: 'left'
  },
});

// Redux mappings
const mapState = state => ({
  username: state.global.username,
  password: state.global.password
});

const mapDispatch = dispatch => ({
  setUsername: name => dispatch(globalActions.setUsername(name)),
  setPassword: password => dispatch(globalActions.setPassword(password))
});

class AccountsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openIdentityDialog: false
    };
  }

  generateNewIdentity = () => {
    this.setState({
      openIdentityDialog: true
    })
  }

  // Clear identity
  logoutIdentity = () => {
    this.props.setUsername('')
    this.props.setPassword('')
  }

  closeIdentityDialog = () => {
    this.setState({
      openIdentityDialog: false
    })
  }

  render() {

    const { 
      classes, 
      username,
      password
    } = this.props;
    const {
      openIdentityDialog
    } = this.state;

    const signed_in = (username && password)
    const wallet_name = (username ? username+"'s Account" : "No Account")
    const hover_text = "These burner wallets will self-destruct when you leave the page unless you choose to save them to your account"

    return (
        <div>
        <Paper className={classes.paper} elevation={3}>
            <Tooltip title={hover_text} placement="top">
              {/* Create a new account */}
              <Typography variant="subtitle1" className={classes.button}> 
                  <Button 
                    color="primary" 
                    aria-label="New Account"
                    onClick={this.generateNewIdentity}
                  >
                    <AccountCircle />
                    {wallet_name}
                  </Button>
              </Typography>
            </Tooltip>
            {/* Sign out of account */}
            {signed_in && (<Typography variant="subtitle1" className={classes.button}> 
                <Button 
                  color="primary" 
                  aria-label="Logout"
                  onClick={this.logoutIdentity}
                >
                  <Clear />
                  Logout
                </Button>
            </Typography>)}
            <IdentityDialog open={openIdentityDialog} onCloseHandler={this.closeIdentityDialog} />
            {/* ETH  */}
            <EthAccounts />
            {/* EOS  */}
            <EosAccounts />
        </Paper>
        </div>
    )
  }
}

AccountsPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapState, mapDispatch)(withRoot(withStyles(styles)(AccountsPage)));
