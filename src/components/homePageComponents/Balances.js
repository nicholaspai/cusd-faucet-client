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
import { telosActions } from "../../store/telosActions";
import { oreActions } from "../../store/oreActions";
import { tronActions } from "../../store/tronActions";
import { harmonyActions } from "../../store/harmonyActions";
import { viteActions } from "../../store/viteActions";

// WEB3 Services
import { updateUserBalance } from '../../eth_services/updateUserBalance'
// EOS Services
import { updateEosBalance } from '../../eos_services/updateEosBalance'
// TELOS Services
import { updateTelosBalance } from '../../telos_services/updateTelosBalance'
// ORE Services
import { updateOreBalance } from '../../ore_services/updateOreBalance'
// Tron Services
import { updateTronBalance } from '../../tron_services/updateTronBalance'
// Harmony Services
import { updateHarmonyBalance } from '../../harmony_services/getBalance'
// Vite Services
import { updateViteBalance } from '../../vite_services/getBalance'

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
  telos_client: state.global.telos_client,
  telos_name: state.telos.user_name,
  telos_balance_tlosd: state.telos.balance_tlosd,
  ore_client: state.global.ore_client,
  ore_name: state.ore.user_name,
  ore_balance_ored: state.ore.balance_ored,
  network: state.global.network,
  tron_address: state.tron.user_address,
  tronWeb: state.global.tronWeb,
  balance_cusd_tron: state.tron.balance_cusd,
  harmony_address: state.harmony.user_name,
  harmony_balance_oned: state.harmony.balance_oned,
  vite_address: state.vite.user_name,
  vite_balance_vited: state.vite.balance_vited
});

const mapDispatch = dispatch => ({
  setEthBalance: balance => dispatch(ethActions.setEthBalance(balance)),
  setEosBalance: balance => dispatch(eosActions.setEosBalance(balance)),
  setTelosBalance: balance => dispatch(telosActions.setTelosBalance(balance)),
  setOreBalance: balance => dispatch(oreActions.setOreBalance(balance)),
  setTronBalance: balance => dispatch(tronActions.setTronBalance(balance)),
  setHarmonyBalance: balance => dispatch(harmonyActions.setHarmonyBalance(balance)),
  setViteBalance: balance => dispatch(viteActions.setViteBalance(balance))
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

  // On Telos:
  _updateTelosBalance = async () => {
    if (this.props.telos_name) { 
      let oldBalance = this.props.telos_balance_tlosd
      let newBalance = await updateTelosBalance(this.props.telos_name)
      if (oldBalance !== newBalance){
       this.props.setTelosBalance(newBalance)
     }
    }
  }

  // On Ore:
  _updateOreBalance = async () => {
    if (this.props.ore_name) { 
      let oldBalance = this.props.ore_balance_ored
      let newBalance = await updateOreBalance(this.props.ore_name)
      if (oldBalance !== newBalance){
       this.props.setOreBalance(newBalance)
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

  // On Harmony
  _updateHarmonyBalance = async (user) => {
    let short_balance = await updateHarmonyBalance(user)
    if (short_balance >= 0 ) {
        if (short_balance !== this.props.harmony_balance_oned) {
          this.props.setHarmonyBalance(short_balance)
        }
    } else {
      this.props.setHarmonyBalance("N/A")
    }
  }

   // On Vite
   _updateViteBalance = async (user) => {
    let balance = await updateViteBalance(user)
    let availableBalance = balance.availableBalances[0].balance.toNumber()
    if (availableBalance >= 0 ) {
        if (availableBalance !== this.props.vite_balance_vited) {
          this.props.setViteBalance(availableBalance)
        }
    } else {
      this.props.setViteBalance("N/A")
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
      await this._updateEosBalance()
    } else if (this.props.network === 2) {
      // @dev Tron Smart contracts deal with Hex addresses, like Solidity
      await this._updateTronBalance(this.props.tron_address.hex)
    } else if (this.props.network === 3) {
      await this._updateTelosBalance()
    } else if (this.props.network === 4) {
      await this._updateOreBalance()
    } else if (this.props.network === 5) {
      await this._updateHarmonyBalance(this.props.harmony_address)
    } else if (this.props.network === 6) {
      await this._updateViteBalance(this.props.vite_address)
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
      telos_balance_tlosd,
      ore_balance_ored,
      harmony_balance_oned,
      vite_balance_vited,
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
    } else if (network === 3) {
      balance = telos_balance_tlosd
    } else if (network === 4) {
      balance = ore_balance_ored
    } else if (network === 5) {
      balance = harmony_balance_oned
    } else if (network === 6) {
      balance = vite_balance_vited
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
