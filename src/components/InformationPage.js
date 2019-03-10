import React, { Component } from 'react';
import withRoot from '../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

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
        <div>
        <Paper className={classes.paper} elevation={3}>
            <Typography variant="body1" className={classes.section}> 
                <b>A Universal Wallet for a Global Digital Market</b>: This is the embodiment of our cross-chain open-source wallet initiative where we intend to link user 
                identities with cryptonetwork accounts. We support the following cryptonetwork testnets: Ethereum (Ropsten), EOS (Jungle), and Tron (Shasta).
            </Typography>
            <Typography variant="body1" className={classes.section}> 
                <b>CUSD Testnet Faucet</b>: Mint, transfer, and redeem CUSD via our token faucet on a testnet. CUSD was <i>made for developers</i> and experimental minds 
                curious how cryptoeconomics succeed at scale 👩🏽‍🚀
            </Typography>
            <Typography variant="body1" className={classes.section}> 
                <b>Ethereum MetaTransactions</b>: We are powered by "metatransactions", in which users do not have to pay ETH transaction fees on this portal.  We pay your ETH gas fees, you pay us back in CUSD. 🧞‍
            </Typography>
            <Typography variant="body1" className={classes.section}> 
                <b>Account Management</b>: No cryptonetwork account? No problem, you can create a <i>burner</i> account
                through our management portal. We will <b>never</b> store your keys or passwords because these burner accounts were designed to self-destruct.
                For top security, move CUSD to a more secure cold-storage wallet like Scatter or Metamask! 🗝💵🗝
            </Typography>
        </Paper>
        <Paper className={classes.paper} elevation={3}>
            <a href="https://github.com/nicholaspai/cusd-faucet-client" target="_blank" rel="noopener noreferrer">
              <Button variant="contained" className={classes.section}> 
                Github Repo
              </Button>
            </a>
        </Paper>
        </div>
    )
  }
}

InformationPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(InformationPage));
