import React, { Component } from 'react';
import './App.css';
import withRoot from './withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';

// Redux state
import { connect } from "react-redux";
import { globalActions, PAGES } from "./store/globalActions";

// WEB3 Services
import Web3 from 'web3';
import getDefaultWeb3 from './eth_services/getDefaultWeb3'

// Core Wallet Pages + Header
import Header from './components/Header'
import HomePage from './components/HomePage'
import AccountsPage from './components/AccountsPage'
import InformationPage from './components/InformationPage'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  main: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 5,
  },
  information: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 5,
  },
  accounts: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 5,
  }
});

// Redux mappings
const mapState = state => ({
  page: state.global.page,
  web3: state.global.web3,
  network: state.global.network
});

const mapDispatch = dispatch => ({
  setWeb3: web3 =>
    dispatch(globalActions.setWeb3(web3)),
  setWeb3Network: number => dispatch(globalActions.setWeb3Network(number)),
  setNetwork: number => dispatch(globalActions.setNetwork(number))
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  /** SET UP WEB3 */
  // Detect or set window.web3 ethereum connection
  setGlobalWeb3 = async () => {

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

  /** ACTIONS TO PERFORM ON LOAD */
  componentDidMount = async () => {
    // Request user's web3 connection
    await this.setGlobalWeb3() 
  }

  render() {

    const { 
      classes,
      page 
    } = this.props;

    return (
      <div className={classes.root}>
        <Header />
        { page === PAGES.MAIN ? (
          <div className={classes.main}>
            <HomePage />
          </div>
        ): ("")}
        { page === PAGES.INFO ? (
          <div className={classes.information}>
            <InformationPage />
          </div>
        ): ("")}
        { page === PAGES.ACCOUNTS ? (
          <div className={classes.accounts}>
            <AccountsPage />
          </div>
        ): ("")}
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(connect(mapState, mapDispatch)(withStyles(styles)(App)));
