import React, { Component } from 'react';
import withRoot from '../../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

// Redux state
import { connect } from "react-redux";

// Web3 Services
import getNetworkNameById from '../../eth_services/getNetworkNameById'

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
  web3_network: state.global.web3_network,
  network: state.global.network,
  eos_name: state.eos.user_name,
  telos_name: state.telos.user_name,
  ore_name: state.ore.user_name,
  harmony_name: state.harmony.user_name,
  tron_address: state.tron.user_address,
  vite_name: state.vite.user_name
});

const mapDispatch = dispatch => ({
});

class Accounts extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {

    const { 
      classes, 
      eth_address, 
      tron_address,
      web3_network,
      network,
      eos_name,
      telos_name,
      ore_name,
      harmony_name,
      vite_name
    } = this.props;

    // ETH
    const user_short = eth_address ? eth_address.substring(0, 8) : "" 
    const networkName = (web3_network ? getNetworkNameById(web3_network) : "")

    // Tron
    const user_short_tron = tron_address ? tron_address.base58.substring(0, 8) : ""
    
    return (
        <Paper className={classes.paper} elevation={3}>
            {network === 0 && (
            <Typography> 
                You are connected to Ethereum ({networkName ? networkName : ""}) as: 
                    {eth_address ? (<a
                    href={"https://ropsten.etherscan.io/address/" + eth_address}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    {user_short}...
                    </a>) : ("")}
            </Typography>)}
            {network === 1 && (
            <Typography> 
                You are connected to EOS Jungle testnet as: {eos_name ? (<a
                    href={"https://jungle.bloks.io/account/" + eos_name}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    {eos_name}
                    </a>) : ("")}
              </Typography>)}
            {network === 2 && (
            <Typography> 
                You are connected to Tron (Shasta) as: 
                    {tron_address ? (<a
                    href={"https://shasta.tronscan.org/#/address/" + tron_address.base58}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    {user_short_tron}...
                    </a>) : ("")}
            </Typography>
            )}
            {network === 3 && (
            <Typography> 
                You are connected to TELOS testnet as: {telos_name ? (<a
                    href={"https://telos-test.bloks.io/account/" + telos_name}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    {telos_name}
                    </a>) : ("")}
              </Typography>
            )}
            {network === 4 && (
            <Typography> 
                You are connected to ORE staging net as: {ore_name ? (<a
                    href={"https://staging-explorer-dot-open-rights-exchange.appspot.com/accounts/" + ore_name}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    {ore_name}
                    </a>) : ("")}
              </Typography>
            )}
            {network === 5 && (
            <Typography> 
                You are connected to HARMONY test net as: {harmony_name ? (<a
                    href={"https://explorer.testnet.harmony.one/#/address/" + harmony_name}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    {harmony_name}
                    </a>) : ("")}
              </Typography>
            )}
            {network === 6 && (
            <Typography> 
                You are connected to VITE test net as: {vite_name ? (<a
                    href={"https://explorer.vite.net/account/" + vite_name}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    {vite_name}
                    </a>) : ("")}
              </Typography>
            )}
        </Paper>
    )
  }
}

Accounts.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(connect(mapState, mapDispatch)(withStyles(styles)(Accounts)));
