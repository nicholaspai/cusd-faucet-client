import React, { Component } from 'react';
import withRoot from '../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

// Redux state
import { connect } from "react-redux";
import { } from "../store/accountsActions";

// Custom Components
import EthAccounts from './accountsComponents/EthAccounts'
import EosAccounts from './accountsComponents/EosAccounts'

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
});

const mapDispatch = dispatch => ({
});

class AccountsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {

    const { 
      classes, 
    } = this.props;

    return (
        <div>
        <Paper className={classes.paper} elevation={3}>
            <Typography variant="subtitle1" className={classes.section}> 
                <b>Account Management</b>:
            </Typography>
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
