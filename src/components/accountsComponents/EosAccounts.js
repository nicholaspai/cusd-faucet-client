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
import { accountsActions } from "../../store/accountsActions";

// Custom Components
import EtherscanLogo from '../helpers/EtherscanLogo'

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
  }
});

// Redux mappings
const mapState = state => ({
  eos_accounts: state.accounts.eos_accounts,
});

const mapDispatch = dispatch => ({
  addEosAccount: newAccount => dispatch(accountsActions.addEosAccount(newAccount)),
});

class EosAccounts extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  handleClick_AddEosAccount = async () => {
    let new_account = "placeholder-"+this.props.eos_accounts.length.toString()

    this.props.addEosAccount(new_account)
  }

  render() {

    const { 
      classes, 
      eos_accounts,
    } = this.props;

    return (
        <Paper className={classes.paper} elevation={3}>
              <Typography variant="body1" className={classes.section}> 
                  <b>EOS Accounts</b>: 
              </Typography>
              {/* Add EOS Accounts */}
              <Button 
                variant="contained" 
                onClick={this.handleClick_AddEosAccount}
                disabled={false}
              >
                New
              </Button>
              {/* View EOS Accounts */}
              { eos_accounts.length > 0 ? (
              <div>
                <Typography> 
                  Your EOS accounts: 
                </Typography>
                {eos_accounts.map((account, i) => {
                  return (<Typography key={i}> 
                    <EtherscanLogo /> ({i}): 
                    <a
                      href={"https://bloks.io/account/" + account}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" view account"}
                    </a>
                  </Typography>)
                })}
              </div> ) : ("")}
        </Paper >
    )
  }
}

EosAccounts.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapState, mapDispatch)(withRoot(withStyles(styles)(EosAccounts)));
