import React, { Component } from 'react';
import withRoot from '../../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'

// Redux state
import { connect } from "react-redux";
import { ethActions } from "../../store/ethActions";

// Custom Components
import EtherscanLogo from '../helpers/EtherscanLogo'
import SignMessageSnackbar from '../helpers/SignMessageSnackbar'

// WEB3 Services
import { sendCUSD } from '../../eth_services/sendCUSD'

// REST API server
import axios from 'axios'
import config from "../../config"
const SERVER = config.server_url
const RELAYER_ENDPOINT = SERVER+"api/faucet/relayer"

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
  eth_address: state.eth.user_address,
  eth_wallet: state.eth.user_wallet,
  web3: state.global.web3,
  pending_transfers: state.eth.pending_transfers,
});

const mapDispatch = dispatch => ({
  concatPendingTransfers: newTransfer => dispatch(ethActions.concatPendingTransfers(newTransfer)),
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
    let web3 = this.props.web3
    if (web3) {
      let amountToTransfer = web3.utils.toWei(this.state.amount_to_transfer, 'ether')
  
      let from = this.props.eth_address
      let to = this.state.transfer_to
      if (!web3.utils.isAddress(to)) {
        console.log('invalid user address: (to) ', to)
        return
      }
      if (!web3.utils.isAddress(from)) {
        console.log('invalid user address: (from) ', from)
        return
      }

      this.setState({
        transferring: true
      })

      try {
        let relayer_status = await axios.get(
          RELAYER_ENDPOINT
        )
        let relayer_balance = relayer_status.data.balance_relayer
        if (relayer_balance <= 0) {
          alert('Relayer does not have enough eth to forward metatransfer :(')
          this.setState({
            transferring: false
          })
        }

        let post_data = await sendCUSD(web3, from, to, amountToTransfer, this.props.eth_wallet)
        
        let response
        try {
          response = await axios.post(
            RELAYER_ENDPOINT,
            post_data
          );
        } catch (err) {
          this.setState({
            transferring: false
          })
          console.error("please be patient in between transactions") ;
          return ; 
        }

        let pending_hash = response.data.hash
        this.props.concatPendingTransfers(pending_hash)
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
      eth_address,
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
              { !eth_address ?
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
                  <EtherscanLogo /> ({i}): 
                  <a
                  href={"https://ropsten.etherscan.io/tx/" + pending_hash}
                  target="_blank"
                  rel="noopener noreferrer"
                  >
                  {" track on Etherscan"}
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
