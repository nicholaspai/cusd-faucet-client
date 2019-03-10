import React, { Component } from 'react';
import withRoot from '../../../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'

// Redux state
import { connect } from "react-redux";
import { eosActions } from "../../../store/eosActions";

// EOS services
import { CONTRACT_CODE, CURRENCY_PRECISION, transactionOptions } from '../../../eos_services/getDefaultEosJS'

// Custom Components
import BloksLogo from '../../helpers/BloksLogo'
import SignMessageSnackbar from '../../helpers/SignMessageSnackbar'

const styles = theme => ({
  paper: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 1,
    marginLeft: theme.spacing.unit * 5,
    marginRight: theme.spacing.unit * 5,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

// Redux mappings
const mapState = state => ({
  eos_name: state.eos.user_name,
  eos_api: state.global.eos_client,
  pending_burns: state.eos.pending_burns
});

const mapDispatch = dispatch => ({
  concatPendingBurns: newBurn => dispatch(eosActions.concatPendingBurns(newBurn)),
});

class BurnButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      burning: false,
      amount_to_burn: ''
    };
  }
  /** BUTTON CLICK HANDLERS */

  // Redeem CUSD by burning
  handleClick_Burn = async () => {
    let amount = parseFloat(this.state.amount_to_burn)
    if (this.props.eos_api) {
      this.setState({
          burning: true
      })
      try {
        let resultWithConfig = await this.props.eos_api.transact({
          actions: [
            {
              account: CONTRACT_CODE,
              name: "burn",
              authorization: [
                {
                  actor: this.props.eos_name,
                  permission: "active"
                }
              ],
              data: {
                from: this.props.eos_name,
                quantity: amount.toFixed(CURRENCY_PRECISION) + " CUSD",
                memo: "Carbon Jungle Faucet: burning " + amount.toFixed(CURRENCY_PRECISION) + " CUSD"
              }
            }
          ]
        }, transactionOptions)
        this.props.concatPendingBurns(resultWithConfig.transaction_id)
        this.setState({
            burning: false
        })
      } catch (err) {
        this.setState({
          burning: false
        })
      }
    }
  }

  /** END BUTTON CLICK HANDLERS */


  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {

    const { 
      classes, 
      eos_name,
      pending_burns
    } = this.props;
    const {
      burning,
      amount_to_burn
    } = this.state

    return (
          <Paper className={classes.paper} elevation={3}>
            {/* BURN CUSD  */}
              { !eos_name ?
              (
                <Button disabled>Please sign in to redeem CUSD!</Button>
              )
              : (
                <div>
                <form>
                  <TextField
                    id="burn-amount"
                    label="Amount"
                    type="number"
                    className={classes.textField}
                    value={amount_to_burn}
                    onChange={this.handleChange('amount_to_burn')}
                    margin="normal"
                  />
                </form>
                <Button
                  onClick={this.handleClick_Burn}
                  disabled={
                    burning ||
                    isNaN(amount_to_burn) ||
                    amount_to_burn <= 0
                  }
                  variant="contained"
                  color="secondary"
                >
                  Redeem {amount_to_burn ? amount_to_burn : ""} CUSD
                </Button>
                </div>
              )
              }
            {/* BURN TXNS  */}
            { pending_burns.length > 0 ? (
            <div>
              <Typography> 
                Your burn transactions: 
              </Typography>
              {pending_burns.map((pending_hash, i) => {
                return (<Typography key={i}> 
                  <BloksLogo /> ({i}): 
                  <a
                    href={"https://jungle.bloks.io/transaction/" + pending_hash}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {" track on Bloks.io"}
                  </a>
                </Typography>)
              })}
            </div> ) : ("")}
            {/* SNACKBAR ALERTS */}
            <SignMessageSnackbar open={burning} />
          </Paper>
    );
  }
}

BurnButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(connect(mapState, mapDispatch)(withStyles(styles)(BurnButton)));
