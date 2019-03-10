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

// Eos services
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
  }
});

// Redux mappings
const mapState = state => ({
  eos_name: state.eos.user_name,
  eos_api: state.global.eos_client,
  pending_transfers: state.eos.pending_transfers,
});

const mapDispatch = dispatch => ({
  concatPendingTransfers: newTransfer => dispatch(eosActions.concatPendingTransfers(newTransfer)),
});

class TransferButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transferring: false,
      amount_to_transfer: '',
      transfer_to: '',
    };
  }
  
  /** BUTTON CLICK HANDLERS */

  // Transfer CUSD to another user
  handleClick_Transfer = async () => {
    let amount = parseFloat(this.state.amount_to_transfer)
    if (this.props.eos_api) {
      this.setState({
          transferring: true
      })
      try {
        let resultWithConfig = await this.props.eos_api.transact({
          actions: [
            {
              account: CONTRACT_CODE,
              name: "transfer",
              authorization: [
                {
                  actor: this.props.eos_name,
                  permission: "active"
                }
              ],
              data: {
                from: this.props.eos_name,
                to: this.state.transfer_to,
                quantity: amount.toFixed(CURRENCY_PRECISION) + " CUSD",
                memo: "Carbon Jungle Faucet: transferring " + amount.toFixed(CURRENCY_PRECISION) + " CUSD"
              }
            }
          ]
        }, transactionOptions)
        this.props.concatPendingTransfers(resultWithConfig.transaction_id)
        this.setState({
            transferring: false
        })
      } catch (err) {
        this.setState({
            transferring: false
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
      pending_transfers
    } = this.props;
    const {
      transferring,
      transfer_to,
      amount_to_transfer
    } = this.state;

    return (
        <Paper className={classes.paper} elevation={3}>
          {/* TRANSFER CUSD  */}
              { !eos_name ?
              (
              <Button disabled>Please sign in to send CUSD!</Button>
              )
              : (
              <div>
              <form>
                  <TextField
                  id="transfer-to"
                  label="Transfer To"
                  className={classes.textField}
                  value={transfer_to}
                  onChange={this.handleChange('transfer_to')}
                  margin="normal"
                  />
                  <TextField
                  id="transfer-amount"
                  label="Amount"
                  type="number"
                  className={classes.textField}
                  value={amount_to_transfer}
                  onChange={this.handleChange('amount_to_transfer')}
                  margin="normal"
                  />
              </form>
              <Button
                  onClick={this.handleClick_Transfer}
                  disabled={
                  transferring ||
                  !transfer_to ||
                  isNaN(amount_to_transfer) ||
                  amount_to_transfer <= 0
                  }
                  variant="contained"
                  color="secondary"
              >
                  Transfer {amount_to_transfer ? amount_to_transfer : ""} CUSD
              </Button>
              </div>
              )
              }
          {/* TRANSFER TXNS  */}
          { pending_transfers.length > 0 ? (
          <div>
              <Typography> 
              Your transfer transactions: 
              </Typography>
              {pending_transfers.map((pending_hash, i) => {
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
          <SignMessageSnackbar open={transferring} />
        </Paper>
    );
  }
}

TransferButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(connect(mapState, mapDispatch)(withStyles(styles)(TransferButton)));
