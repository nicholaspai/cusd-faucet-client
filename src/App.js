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

// Core Wallet Pages + Header
import Header from './components/Header'
import HomePage from './components/HomePage'
import AccountsPage from './components/AccountsPage'
import InformationPage from './components/InformationPage'

// Config 
import config from './config'

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
  web3: state.global.web3,
  page: state.global.page,
});

const mapDispatch = dispatch => ({
  setWeb3: web3 =>
    dispatch(globalActions.setWeb3(web3)),
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  /** SET UP WEB3 */
  // Detect or set window.web3 ethereum connection
  setWindowWeb3 = async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.enable();
            
            // Store web3 instance in redux store
            this.props.setWeb3(window.web3)
        } catch (error) {
            // User denied account access...
            console.log('user denied ethereum account access')
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        this.props.setWeb3(window.web3)
    }
    // Non-dapp browsers...
    else {
        var WEB_3_NODE = ('wss://ropsten.infura.io/ws/v3/'+config.infura_public_key)
        let non_provider_web3 = new Web3(new Web3.providers.WebsocketProvider(WEB_3_NODE));
        this.props.setWeb3(non_provider_web3)
        alert('Non-Ethereum browser detected! This is not a problem, because we can create accounts for you, but we recommend getting a more secure cold-storage for the long-term.');
    }
  }

  /** ACTIONS TO PERFORM ON LOAD */
  componentDidMount = async () => {
    // Request user's web3 connection
    await this.setWindowWeb3() 
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
