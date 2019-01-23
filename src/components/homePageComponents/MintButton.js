import React, { Component } from 'react';
import withRoot from '../../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

// Redux state
import { connect } from "react-redux";
import { ethActions } from "../../store/ethActions";

// Custom Components
import EtherscanLogo from '../helpers/EtherscanLogo'

// REST API server
import axios from 'axios'
import config from "../../config"
const SERVER = config.server_url
const MINTER_ENDPOINT = SERVER+"api/faucet/minter"

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
  pending_mints: state.eth.pending_mints,
});

const mapDispatch = dispatch => ({
  concatPendingMints: newMint => dispatch(ethActions.concatPendingMints(newMint)),
});

class MintButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount_to_mint: "10.3141",
      minting: false,
    };
  }

  /** BUTTON CLICK HANDLERS */

  // Mint new CUSD to user
  handleClick_Mint = async () => {
    let web3 = this.props.web3
    if (web3) {
      let amountToMint = web3.utils.toWei(this.state.amount_to_mint, 'ether')
  
      let to = this.props.eth_address
      if (!web3.utils.isAddress(to)) {
        console.error('invalid user address: ', to)
        return
      }

      let post_data = {
        amount: amountToMint.toString(),
        user: to
      }

      this.setState({
        minting: true
      })

      try {
        // TODO: Each pending mint should have a Number:mint_id, and a status: pending, failed, success
        let minter_status = await axios.get(
          MINTER_ENDPOINT
        )
        let minter_balance = minter_status.data.minter_balance
        if (minter_balance <= 0) {
          alert('Minter does not have enough eth to mint :(')
          this.setState({
            minting: false
          })
        }

        // API CALL
        let response
        try {
          response = await axios.post(
            MINTER_ENDPOINT,
            post_data
          );
        } catch (err) {
          this.setState({
            minting: false
          })
          console.error("please be patient in between transactions") ;
          return ; 
        }

        let pending_hash = response.data.pending_hash
        this.props.concatPendingMints(pending_hash)
        this.setState({
          minting: false
        })
      } catch (err) {
        this.setState({
          minting: false
        })
      }
    }
  }

  /** END BUTTON CLICK HANDLERS */

  render() {

    const { 
      classes, 
      eth_address,
      pending_mints
    } = this.props;
    
    return (
          <Paper className={classes.paper} elevation={3}>
            {/* MINT BUTTON  */}
            { !eth_address ?
              (
                <Button disabled>Please sign in get CUSD!</Button>
              )
              : (
                <Button
                  onClick={this.handleClick_Mint}
                  disabled={this.state.minting}
                  variant="contained"
                  color="secondary"
                >
                  Mint me {this.state.amount_to_mint} CUSD
                </Button>
              )
            }
            {/* MINT TXNS  */}
            { pending_mints.length > 0 ? (
            <div>
              <Typography> 
                Your mint transactions: 
              </Typography>
              {pending_mints.map((pending_hash, i) => {
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

MintButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(connect(mapState, mapDispatch)(withStyles(styles)(MintButton)));
