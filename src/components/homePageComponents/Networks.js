import React, { Component } from 'react';
import withRoot from '../../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'

// Redux state
import { connect } from "react-redux";
import { globalActions, NETWORKS } from "../../store/globalActions";
import { eosActions } from "../../store/eosActions";
import { tronActions } from "../../store/tronActions";
import { harmonyActions } from "../../store/harmonyActions";
import { viteActions } from "../../store/viteActions";

//scatter
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';
import getDefaultTronWeb from '../../tron_services/getDefaultTronWeb'
import Web3 from 'web3';
import getDefaultWeb3 from '../../eth_services/getDefaultWeb3'

const styles = theme => ({
  paper: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 1,
    marginLeft: theme.spacing.unit * 5,
    marginRight: theme.spacing.unit * 5,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

// Redux mappings
const mapState = state => ({
  network: state.global.network,
  scatter_state: state.eos.scatter_state,
  tronWeb: state.global.tronWeb,
  web3: state.global.web3,
});

const mapDispatch = dispatch => ({
  setNetwork: NETWORK => dispatch(globalActions.setNetwork(NETWORK)),
  setScatterState: string => dispatch(eosActions.setScatterState(string)),
  setTronAddress: string => dispatch(tronActions.setTronAddress(string)),
  setTronWeb: tronweb => dispatch(globalActions.setTronWeb(tronweb)),
  setWeb3: web3 =>
    dispatch(globalActions.setWeb3(web3)),
  setWeb3Network: number => dispatch(globalActions.setWeb3Network(number)),
  setHarmonyAddress: string => dispatch(harmonyActions.setHarmonyName(string)),
  setViteAddress: string => dispatch(viteActions.setViteName(string))
});


class Networks extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  /** Connect App to Scatter for EOS api connection */
  _checkScatterConnection = async () => {
    if (this.props.scatter_state) {
      // Scatter already set
      return
    } else {
      // tell ScatterJS which plugins you are using.
      ScatterJS.plugins( new ScatterEOS())

      // attempt to connect to Scatter app
      const APP_NAME="CUSD_OASIS"
      let connected = await ScatterJS.scatter.connect(APP_NAME)
      if (connected) {
            let scatter = ScatterJS.scatter
            this.props.setScatterState(scatter)
            // replace window's default ScatterJS object
            window.ScatterJS = null
      }
      return
    }
  }

  /** SET UP TronWeb */
  _checkTronConnection = async () => {
    // Set tronweb to injected tronweb if possible
    let installed = window.tronWeb
    // Detected Tron dapp browser! 
    if (installed) {
        this.props.setTronWeb(window.tronWeb)
    } 
    else {
      // Create default tronweb in case browser cannot inject tronweb
      let default_tronweb = await getDefaultTronWeb()
      this.props.setTronWeb(default_tronweb)

      // Non-dapp browsers, inject tronweb on behalf of user
      window.tronWeb = this.props.tronWeb
    }
  }

  /** FIXME: Harmony Client */
  _checkHarmonyConnection = async () => {
    this.props.setHarmonyAddress('one12dhftev0pcg5hq9z2ekx9v6fntylxaytdzjttn')
  }

  /** FIXME: Vite Client */
  _checkViteConnection = async () => {
    this.props.setViteAddress('vite_c9ef472d042db72d66ade363abdb8327a162b9cb89ed20eae5')
  }

    /** SET UP Web3 */
  _checkEthereumConnection = async () => {

    // Set default web3 in case browser cannot inject web3
    let default_web3 = await getDefaultWeb3()
    this.props.setWeb3(default_web3.web3)
    this.props.setWeb3Network(default_web3.network)

    // Now, replace web3 with injected web3 if possible
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        
        try {
            // Request account access if needed
            await window.ethereum.enable()
            // Store web3 instance in redux store
            this.props.setWeb3(window.web3)
            let network = await window.web3.eth.net.getId()
            this.props.setWeb3Network(network)
        } catch (error) {
            // User denied account access... setting fallback web3 object to access web3 
            console.log('user denied ethereum account access')
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        this.props.setWeb3(window.web3)
        let network = await window.web3.eth.net.getId()
        this.props.setWeb3Network(network)
    }
    // Non-dapp browsers...
    else {
    }
  }  

  /** CONTINUOUS TIMER BEGINNING AT MOUNT */
  componentDidMount = async () => {
    var intervalId = setInterval(this.timer, 1000);
    // store intervalId in the state so it can be accessed later:
    this.setState({intervalId: intervalId});
  }

  // @dev Put anything that you want to continually compute here
  timer = async () => {

    if (this.props.network === 1 || this.props.network === 3 || this.props.network === 4){      
      await this._checkScatterConnection()
    } else if (this.props.network === 2) {
      await this._checkTronConnection()
    } else if (this.props.network === 0) {
      await this._checkEthereumConnection()
    } else if (this.props.network === 5) {
      await this._checkHarmonyConnection()
    } else if (this.props.network === 6) {
      await this._checkViteConnection()
    }
  }

  componentWillUnmount = () => {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }



  handleChange = name => event => {
    var current = parseFloat(event.target.value);

    // @dev network must be of type Number
    this.props.setNetwork(current);
    if (current === 1){
      //EOS
    } 
    else if (current === 0) {
      //ETH
    }
    else if (current === 2) {
    //TRON  
    }
    else if (current === 3) {
      //TELOS  
    } 
    else if (current === 4) {
      //ORE  
    }
    else if (current === 5) {
      //HARMONY  
    }
    else if (current === 6) {
      //VITE  
    }
    else {
      throw (Error(`Invalid network provided: ${current}`))
    } 

  };

  render() {

    const { 
      classes
    } = this.props;

    return (
        <div>
        <Paper className={classes.paper} elevation={3}>
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="network-selector">Network</InputLabel>
                <Select
                    native
                    value={this.state.age}
                    onChange={this.handleChange('network')}
                    inputProps={{
                    name: 'network',
                    id: 'network-native-simple',
                    }}
                >
                    <option value={NETWORKS.EOS}>EOS (Jungle)</option>
                    <option value={NETWORKS.ETH}>ETH (Ropsten)</option>
                    <option value={NETWORKS.TRON}>TRON (Shasta)</option>
                    {/* Removing Telos temporarily as testnet hardforked and all old accounts (stablecarbon, carbonissuer) need to be redeployed from the beginning--including switching of keys */}
                    <option value={NETWORKS.TELOS}>TELOS (Testnet)</option>
                    <option value={NETWORKS.ORE}>ORE (Staging)</option>
                    <option value={NETWORKS.HARMONY}>Harmony (Testnet)</option>
                    <option value={NETWORKS.VITE}>Vite (Testnet)</option>
                </Select>
            </FormControl>
        </Paper>
        </div>
    )
  }
}

Networks.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapState, mapDispatch)(withRoot(withStyles(styles)(Networks)));
