import React, { Component } from 'react';
import withRoot from '../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';

// Redux state
import { connect } from "react-redux";
import { } from "../store/accountsActions";

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
  section: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    textAlign: 'left'
  },
});

// Redux mappings
const mapState = state => ({
  username: state.global.username
});

const mapDispatch = dispatch => ({
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

  closeIdentityDialog = () => {
    this.setState({
      openIdentityDialog: false
    })
  }

  render() {

    const { 
      classes, 
      username
    } = this.props;
    const {
      openIdentityDialog
    } = this.state;

    const wallet_name = (username ? username+"'s Account" : "No Account")
    const hover_text = "These burner wallets will self-destruct when you leave the page unless you choose to save them to your account"

    return (
        <div>
        <Paper className={classes.paper} elevation={3}>
            <Tooltip title={hover_text} placement="top">
              <Typography variant="subtitle1" className={classes.section}> 
                  <Button 
                    color="primary" 
                    aria-label="New Account"
                    onClick={this.generateNewIdentity}
                  >
                    <AddIcon />
                    {wallet_name}
                  </Button>
              </Typography>
            </Tooltip>
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
