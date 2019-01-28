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
import { eosActions } from "../../store/eosActions";

// Custom Components
import BloksLogo from '../helpers/BloksLogo'

// REST API server
import axios from 'axios'
import config from "../../config"
const SERVER = config.server_url
const MINTER_ENDPOINT = SERVER+"api/eos/faucet"

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
  
  
  eos_mints: state.eos.eos_mints,
  eos_client: state.global.eos_client,
  eos_name: state.eos.user_name,
  network: state.global.network
});

const mapDispatch = dispatch => ({
  concatEosMints: newMint => dispatch(eosActions.concatEosMints(newMint)),
  setEosName: name => dispatch(eosActions.setEosName(name))
});

class MintButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount_to_mint: "10.50",
      minting: false,
    };
  }

  // Refresh user CUSD balance
  getName = () => {
    
    if (!this.props.eos_client.account || this.props.eos_name) return;
    console.log("get name" + this.props.eos_name)
    this.props.setEosName(this.props.eos_client.account.name)

    return this.props.eos_client.account.name
    
  }

  /** CONTINUOUS TIMER BEGINNING AT MOUNT */
  componentDidMount = async () => {
    var intervalId = setInterval(this.timer, 1000);
    // store intervalId in the state so it can be accessed later:
    this.setState({intervalId: intervalId});
  }

  // @dev Put anything that you want to continually compute here
  timer = async () => {

    // Update user balance 
    await this.getName()
  }

  componentWillUnmount = () => {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }
  /** BUTTON CLICK HANDLERS */

  // Mint new CUSD to user
  handleClick_Mint = async () => {
    
	  let to = this.props.eos_name
	  console.log("mintint to " +to + " " + MINTER_ENDPOINT)

	  let post_data = {
	    //amount: amountToMint.toString(),
	    user: to,
      amount: this.state.amount_to_mint.toString(),
	  }

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

	    this.props.concatEosMints(pending_hash)
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
      eos_mints,
      eos_client,
      eos_name,
      network
    } = this.props;
    
    return (
          <Paper className={classes.paper} elevation={3}>
            {/* MINT BUTTON  */}
            { !eos_name ?
              (
                <Button disabled>Please sign in gets CUSD!</Button>
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
            { eos_mints.length > 0 ? (
            <div>
              <Typography> 
                Your mint transactions: 
              </Typography>
              {eos_mints.map((pending_hash, i) => {
                return (<Typography key={i}> 
                  <BloksLogo /> ({i}): 
                  <a
                    href={"https://jungle.bloks.io/transaction/" + pending_hash}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {" track on bloks.io"}
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
