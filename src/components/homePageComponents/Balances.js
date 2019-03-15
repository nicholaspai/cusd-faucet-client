import React, { Component } from 'react';
import withRoot from '../../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

// Redux state
import { connect } from "react-redux";
import { ethActions } from "../../store/ethActions";
import { eosActions } from "../../store/eosActions";
import { tronActions } from "../../store/tronActions";

// WEB3 Services
import { updateUserBalance } from '../../eth_services/updateUserBalance'
// EOS Services
import { updateEosBalance } from '../../eos_services/updateEosBalance'
// Tron Services
import { updateTronBalance } from '../../tron_services/updateTronBalance'

// CUSD Currency Logo
import CarbonLogo from '../helpers/CarbonLogo'

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
  balance_cusd: state.eth.balance_cusd,
  eos_client: state.global.eos_client,
  eos_name: state.eos.user_name,
  eos_balance_cusd: state.eos.balance_cusd,
  network: state.global.network,
  tron_address: state.tron.user_address,
  tronWeb: state.global.tronWeb,
  balance_cusd_tron: state.tron.balance_cusd
});

const mapDispatch = dispatch => ({
  setEthBalance: balance => dispatch(ethActions.setEthBalance(balance)),
  setEosBalance: balance => dispatch(eosActions.setEosBalance(balance)),
  setTronBalance: balance => dispatch(tronActions.setTronBalance(balance)),
});

class Balances extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  // Refresh user CUSD balance

  // On Ethereum:
  _updateUserBalance = async (user) => {
    let web3 = this.props.web3
    if (!web3 || !user) return;
    let short_balance = await updateUserBalance(web3, user)
    if (short_balance >= 0 ) {
        if (short_balance !== this.props.balance_cusd) {
          this.props.setEthBalance(short_balance)
        }
    } else {
      this.props.setEthBalance("N/A")
    }
  }

  // On EOS:
  _updateEosBalance = async () => {
      if (this.props.eos_name) { 
        let oldBalance = this.props.eos_balance_cusd
        let newBalance = await updateEosBalance(this.props.eos_name)
        if (oldBalance !== newBalance){
         this.props.setEosBalance(newBalance)
       }
      }
  }

  // On Tron:
  _updateTronBalance = async (user) => {
    let tronWeb = this.props.tronWeb
    if (!tronWeb || !user) return;
    let short_balance = await updateTronBalance(tronWeb, user)
    if (short_balance >= 0 ) {
        if (short_balance !== this.props.balance_cusd_tron) {
          this.props.setTronBalance(short_balance)
        }
    } else {
      this.props.setTronBalance("N/A")
    }

  }

  /** CONTINUOUS TIMER BEGINNING AT MOUNT */
  componentDidMount = async () => {
    var intervalId = setInterval(this.timer, 5000);
    // store intervalId in the state so it can be accessed later:
    this.setState({intervalId: intervalId});
  }

  // @dev Put anything that you want to continually compute here
  timer = async () => {


    if (this.props.network === 0){
      // Update user balance
      await this._updateUserBalance(this.props.eth_address)
    } else if (this.props.network === 1) {
      await this._updateEosBalance(this.props.eos_client)
    } else if (this.props.network === 2) {
      // @dev Tron Smart contracts deal with Hex addresses, like Solidity
      await this._updateTronBalance(this.props.tron_address.hex)
    }
  }

  componentWillUnmount = () => {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }
  
  render() {

    const { 
      classes, 
      balance_cusd,
      eos_balance_cusd,
      balance_cusd_tron,
      network
    } = this.props;

    let balance
    if (network === 0) {
      balance = balance_cusd
    } else if (network === 1) {
      balance = eos_balance_cusd
    } else if (network === 2) {
      balance = balance_cusd_tron
    }

    return (
          
          <Paper className={classes.paper} elevation={3}>
          {/*h*/}
            <Typography> 
              Your <CarbonLogo /> balance: {balance}
            </Typography>
          
          </Paper>
          
    );
  }
}

Balances.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(connect(mapState, mapDispatch)(withStyles(styles)(Balances)));
