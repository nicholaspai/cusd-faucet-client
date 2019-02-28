import React, { Component } from 'react';
import withRoot from '../../../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

// Redux state
import { connect } from "react-redux";
import { tronActions } from "../../../store/tronActions";

// Custom Components
import TronLogo from '../../helpers/TronLogo'

// REST API server
import axios from 'axios'
import config from "../../../config"
const SERVER = config.server_url
const MINTER_ENDPOINT = SERVER+"api/tron/mint"

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
  tron_address: state.tron.user_address,
  tronWeb: state.global.tronWeb,
  pending_mints: state.tron.pending_mints,
});

const mapDispatch = dispatch => ({
  concatPendingMints: newMint => dispatch(tronActions.concatPendingMints(newMint)),
});

class MintButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount_to_mint: 10,
      minting: false,
    };
  }

  /** BUTTON CLICK HANDLERS */

  // Mint new CUSD to user
  handleClick_Mint = async () => {
    let tronWeb = this.props.tronWeb
    if (tronWeb) {
      // TODO: Tron contracts only deal with integers, need to be able to convert decimals
      let amountToMint = this.state.amount_to_mint
  
      let to = this.props.tron_address.base58
      if (!tronWeb.isAddress(to)) {
        console.error('invalid user address: ', to)
        return
      }

      this.setState({
        minting: true
      })

      try {
        // Second, request minter to mint new CUSD via POST
        let post_data = {
          user_hex: to,
          amount: amountToMint,
        }
        let response = await axios.post(
          MINTER_ENDPOINT,
          post_data
        );

        let pending_hash = response.data.transaction_hash
        this.props.concatPendingMints(pending_hash)
        this.setState({
          minting: false
        })
      } catch (err) {
        console.error('Minting failed, please try again in 5 minutes')
        this.setState({
          minting: false
        })
      }
    } else {
      alert('no tronweb detected')
    }
  }

  /** END BUTTON CLICK HANDLERS */

  render() {

    const { 
      classes, 
      tron_address,
      pending_mints,
    } = this.props;
    
    return (
          <Paper className={classes.paper} elevation={3}>
            {/* MINT BUTTON  */}
            { !tron_address ?
              (
                <Button disabled>Please sign in to get CUSD!</Button>
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
                  <TronLogo /> ({i}): 
                  <a
                    href={"https://shasta.tronscan.org/#/transaction/" + pending_hash}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {" track on Tronscan"}
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
