import React, { Component } from 'react';
import './App.css';
import withRoot from './withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';

// Redux state
import { connect } from "react-redux";
import { globalActions, PAGES } from "./store/globalActions";

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
});

const mapDispatch = dispatch => ({
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  /** ACTIONS TO PERFORM ON LOAD */
  componentDidMount = async () => {
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
