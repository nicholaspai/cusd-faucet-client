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
import { tronActions } from "../../../store/tronActions";

// Tron services
import getCUSD from '../../../tron_services/getCUSD';

// Custom Components
import TronLogo from '../../helpers/TronLogo'
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
  tron_address: state.tron.user_address,
  tronWeb: state.global.tronWeb,
  pending_burns: state.tron.pending_burns
});

const mapDispatch = dispatch => ({
  concatPendingBurns: newBurn => dispatch(tronActions.concatPendingBurns(newBurn)),
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
    let tronWeb = this.props.tronWeb
    if (tronWeb) {
        let amountToBurn = (parseFloat(this.state.amount_to_burn)*(10**18)).toString()
        this.setState({
            burning: true
        })
        try {
            let cusd = await getCUSD(tronWeb)
            let pending_hash = await cusd.burn(amountToBurn).send()
            this.props.concatPendingBurns(pending_hash.toString()) // @dev always .toString() tron smart contract return values
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
      tron_address,
      pending_burns
    } = this.props;
    const {
      burning,
      amount_to_burn
    } = this.state

    return (
          <Paper className={classes.paper} elevation={3}>
            {/* BURN CUSD  */}
              { !tron_address ?
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
