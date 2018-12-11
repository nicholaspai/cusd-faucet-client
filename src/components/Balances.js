import React, { Component } from 'react';
import withRoot from '../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

// Redux state
import { connect } from "react-redux";
import { ethActions } from "../store/ethActions";

// WEB3 Services
import { updateUserBalance } from '../services/updateUserBalance'

const styles = theme => ({
  paper: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 1,
    marginLeft: theme.spacing.unit * 5,
    marginRight: theme.spacing.unit * 5,
  }
});

// Redux mappings
const mapState = state => ({
  eth_address: state.eth.user_address,
  web3: state.global.web3,
  balance_cusd: state.eth.balance_cusd
});

const mapDispatch = dispatch => ({
  setEthBalance: balance => dispatch(ethActions.setEthBalance(balance))
});

class Balances extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  // Refresh user CUSD balance
  _updateUserBalance = async (user) => {
    let web3 = this.props.web3
    if (!web3 || !user) return;
    let short_balance = await updateUserBalance(web3, user)
    if (short_balance >= 0 ) {
        this.props.setEthBalance(short_balance)
    }
  }

  /** CONTINUOUS TIMER BEGINNING AT MOUNT */
  componentDidMount = async () => {
    var intervalId = setInterval(this.timer, 1000);
    // store intervalId in the state so it can be accessed later:
    this.setState({intervalId: intervalId});
  }

  // @dev Put anything that you want to continually compute here
  timer = async () => {
    // Update user balance
    await this._updateUserBalance(this.props.eth_address)
  }

  componentWillUnmount = () => {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }
  
  render() {

    const { 
      classes, 
      balance_cusd
    } = this.props;

    return (
          <Paper className={classes.paper} elevation={3}>
            <Typography> 
              Your CUSD balance: {balance_cusd}
            </Typography>
          </Paper>
    );
  }
}

Balances.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(connect(mapState, mapDispatch)(withStyles(styles)(Balances)));
