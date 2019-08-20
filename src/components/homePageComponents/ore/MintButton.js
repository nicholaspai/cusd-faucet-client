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
import { oreActions } from "../../../store/oreActions";

// Custom Components
import BloksLogo from '../../helpers/BloksLogo'

// REST API server
import axios from 'axios'
import config from "../../../config"
const SERVER = config.server_url
const MINTER_ENDPOINT = SERVER+"api/ore/faucet"

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
  pending_mints: state.ore.pending_mints,
  ore_client: state.global.ore_client,
  ore_name: state.ore.user_name,
  network: state.global.network
});

const mapDispatch = dispatch => ({
  concatPendingMints: newMint => dispatch(oreActions.concatPendingMints(newMint)),
});

class MintButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount_to_mint: "100.0000",
      minting: false,
    };
  }

  /** CONTINUOUS TIMER BEGINNING AT MOUNT */
  componentDidMount = async () => {
    var intervalId = setInterval(this.timer, 1000);
    // store intervalId in the state so it can be accessed later:
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount = () => {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }
  /** BUTTON CLICK HANDLERS */

  // Mint new CUSD to user
  handleClick_Mint = async () => {
    
    let to = this.props.ore_name
    if (!to) { return; } // user not signed in
	  let post_data = {
	    user: to,
      amount: this.state.amount_to_mint.toString(),
    }
    console.log(post_data)

	  this.setState({
	    minting: true
	  })

	  try {
	    // TODO: Each pending mint should have a Number:mint_id, and a status: pending, failed, success
	    //let minter_status = await axios.get(
	    //  MINTER_ENDPOINT
	    //)
	    

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

	    let pending_hash = response.data.transaction_id

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

  /** END BUTTON CLICK HANDLERS */

  render() {

    const { 
      classes, 
      pending_mints,
      ore_name
    } = this.props;
    
    return (
          <Paper className={classes.paper} elevation={3}>
            {/* MINT BUTTON  */}
            { !ore_name ?
              (
                <Button disabled>Please sign in to get ORED!</Button>
              )
              : (
                <Button
                  onClick={this.handleClick_Mint}
                  disabled={this.state.minting}
                  variant="contained"
                  color="secondary"
                >
                  Mint me {this.state.amount_to_mint} ORED
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
                  <BloksLogo /> ({i}): 
                  <a
                    href={"https://staging-explorer-dot-open-rights-exchange.appspot.com/transactions/" + pending_hash}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {" track on block explorer"}
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
