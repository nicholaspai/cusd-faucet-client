import React, { Component } from 'react';
import withRoot from '../../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

// Redux state
import { connect } from "react-redux";
import { eosActions } from "../../store/eosActions";

// EOS Services
import { updateEosBalance } from '../../eos_services/updateEosBalance'

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
  eos_name: state.eos.user_name,
  eos_balance_cusd: state.eos.balance_cusd,
});

const mapDispatch = dispatch => ({
  setEosBalance: balance => dispatch(eosActions.setEosBalance(balance)),
});

class Balances extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  // Refresh user CUSD balance

  // On EOS:
  _updateEosBalance = async () => {
      if (this.props.eos_name) { 
        let oldBalance = this.props.eos_balance_cusd
        let newBalance = await updateEosBalance(this.props.eos_name, true ) // set second param as true to use mainnet contracts
        if (oldBalance !== newBalance){
         this.props.setEosBalance(newBalance)
       }
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
    await this._updateEosBalance()
  }

  componentWillUnmount = () => {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }
  
  render() {

    const { 
      classes, 
      eos_balance_cusd,
      network
    } = this.props;

    let balance = eos_balance_cusd

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
