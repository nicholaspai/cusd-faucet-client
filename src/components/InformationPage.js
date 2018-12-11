import React, { Component } from 'react';
import withRoot from '../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  paper: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 1,
    marginLeft: theme.spacing.unit * 5,
    marginRight: theme.spacing.unit * 5,
  },
  section: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    textAlign: 'left'
  }
});

// Redux mappings
const mapState = state => ({
});

const mapDispatch = dispatch => ({
});

class InformationPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {

    const { 
      classes, 
    } = this.props;

    return (
        <Paper className={classes.paper} elevation={3}>
            <Typography variant="body1" className={classes.section}> 
                <b>A Universal Wallet for a True Digital Economy</b>: This is our cross-chain open-source wallet initiative where we intend to link user 
                identities (used for "Know Your Customer" compliance) with on-chain accounts across 
                multiple networks. Since this is a work in progress, for now we are only supporting
                the Ropsten testnet for Ethereum. 
            </Typography>
            <Typography variant="body1" className={classes.section}> 
                <b>CUSD Ropsten Faucet</b>: Mint, transfer, and "redeem" CUSD via our faucet! CUSD on Ropsten is a super convenient token <i>made for developers</i> that
                any cryptonetwork experiment will find useful. You can be confident knowing that one mainnet CUSD is equivalent to $1, which 
                should make forecasting simpler 👩🏽‍🚀
            </Typography>
            <Typography variant="body1" className={classes.section}> 
                <b>MetaTransactions</b>: We are excited to offer "metatransactions", where users do not need to hold any ETH to pay for transaction fees
                when using CUSD. We pay your ETH gas fees, you compensate us in CUSD, and no one needs to hodl trivial amounts of ETH anymore 🧞‍
            </Typography>
        </Paper>
    )
  }
}

InformationPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(InformationPage));
