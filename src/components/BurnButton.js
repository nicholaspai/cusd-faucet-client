import React, { Component } from 'react';
import withRoot from '../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'

// Redux state
import { connect } from "react-redux";
import { ethActions } from "../store/ethActions";

// Custom Components
import EtherscanLogo from './helpers/EtherscanLogo'

// WEB3 Services
import { burnCUSD } from '../services/burnCUSD'

// REST API server
import axios from 'axios'
import config from '../config'
const SERVER = config.server_url_prod
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
  },
});

// Redux mappings
const mapState = state => ({
  eth_address: state.eth.user_address,
  web3: state.global.web3,
  pending_burns: state.eth.pending_burns
});

const mapDispatch = dispatch => ({
  concatPendingBurns: newBurn => dispatch(ethActions.concatPendingBurns(newBurn)),
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
    let web3 = this.props.web3
    if (web3) {
      let web3 = window.web3
      let amountToBurn = web3.utils.toWei(this.state.amount_to_burn, 'ether')
  
      let from = this.props.eth_address
      if (!web3.utils.isAddress(from)) {
        console.log('invalid user address: (from) ', from)
        return
      }

      this.setState({
        burning: true
      })

      try {
        // TODO: Each pending burn should have a Number:burn_id, and a status: pending, failed, success
        let relayer_status = await axios.get(
          RELAYER_ENDPOINT
        )
        let relayer_balance = relayer_status.balance_relayer
        if (relayer_balance <= 0) {
          alert('Relayer does not have enough eth to forward metatransfer :(')
          this.setState({
            burning: false
          })
        }

        alert('Please sign the burn metatransaction, and we will pay for your ETH gas fees to redeem CUSD!')
        let post_data = await burnCUSD(web3, from, amountToBurn)

        let response = await axios.post(
          RELAYER_ENDPOINT,
          post_data
        );
        
        let pending_hash = response.data.hash
        this.props.concatPendingBurns(pending_hash)
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
      eth_address,
      pending_burns
    } = this.props;

    return (
          <Paper className={classes.paper} elevation={3}>
            {/* BURN CUSD  */}
              { !eth_address ?
              (
                <Button disabled>Please sign in redeem CUSD!</Button>
              )
              : (
                <div>
                <form>
                  <TextField
                    id="burn-amount"
                    label="Amount"
                    type="number"
                    className={classes.textField}
                    value={this.state.amount_to_burn}
                    onChange={this.handleChange('amount_to_burn')}
                    margin="normal"
                  />
                </form>
                <Button
                  onClick={this.handleClick_Burn}
                  disabled={
                    this.state.burning ||
                    isNaN(this.state.amount_to_burn) ||
                    this.state.amount_to_burn <= 0
                  }
                  variant="contained"
                  color="secondary"
                >
                  Redeem {this.state.amount_to_burn ? this.state.amount_to_burn : ""} CUSD
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
          </Paper>
    );
  }
}

BurnButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(connect(mapState, mapDispatch)(withStyles(styles)(BurnButton)));
