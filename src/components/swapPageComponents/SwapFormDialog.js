// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRoot from '../../withRoot';

// @Material-ui
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import MenuItem from '@material-ui/core/MenuItem';
import DialogTitle from '@material-ui/core/DialogTitle';

// Redux state
import { connect } from "react-redux";
import { eosActions } from "../../store/eosActions";
import { globalActions } from "../../store/globalActions"

// Exchange services, used to query market prices
import { getInvertedInsideMarket, postAsk } from '../../exchange_services/dexeos'

// Scatter client for EOS
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';

// Eos services
import { Api } from 'eosjs';
import { rpcMainnet, EOS_NETWORK_MAINNET } from '../../eos_services/getDefaultEosJS'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  menu: {
    width: 200,
  },
});

// Redux mappings
const mapState = state => ({
  eos_name: state.eos.user_name,
  eos_api: state.global.eos_client,
  scatter_state: state.eos.scatter_state,

});

const mapDispatch = dispatch => ({
    setScatterState: string => dispatch(eosActions.setScatterState(string)),
    setEOS:  client => dispatch(globalActions.setEOS(client)),
    setEosName: name => dispatch(eosActions.setEosName(name)),
});

const orderTypes = [
  {
    value: 'Buy',
    label: 'Buy',
  },
  {
    value: 'Sell',
    label: 'Sell',
  },
];

class SwapFormDialog extends Component {
  state = {
    orderType: "",
    insideMarket: "",
    orderAmountOfCusd: 0
  };

  componentDidMount = async () => {
    var intervalId = setInterval(this.timer, 1000);
    // store intervalId in the state so it can be accessed later:
    this.setState({intervalId: intervalId});
  }

  // @dev Put anything that you want to continually compute here
  timer = async () => {
    await this._checkScatterConnection()
  }
  
  /** Save Scatter object for the first time if possible */
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

  /** Request user's EOS identity through Scatter */
  // _loginEos = async () => {
  //   if (!this.props.scatter_state) { return; }
  //   if (this.props.scatter_state.identity) {
  //     // User already signed in, forget their previous identity
  //     // @dev: for simplicity, don't log out here. User can always just switch Pages and come back
  //     // to the swap page to login
  //     // await this.props.scatter_state.logout()

  //     const account = this.props.scatter_state.identity.accounts.find(x => x.blockchain === 'eos');
  //     if (account && account.name) {
  //       // Create eosJS client object
  //       let rpc = rpcMainnet
  //       const eosMainnet = this.props.scatter_state.eos(EOS_NETWORK_MAINNET, Api, {rpc, beta3:true})
  //       this.props.setEOS(eosMainnet)
  //       // Save user's account name (full account details are in account)
  //       this.props.setEosName(account.name)
  //     }
  //     return;
  //   } 
    
  //   // Now, request user to connect their identity for app usage
  //   // After a user has approved giving you permission to access their Identity you no longer have to call getIdentity() if the user refreshes the page. 
  //   // Instead you can check if an Identity exists on the scatter object itself. 
  //   // This also means that you don't have to save the Identity within your shared 
  //   // services along-side your Scatter reference, 
  //   // you can simply save your Scatter reference and 
  //   // pull the identity from within it.
  //   //
  //   // n.b. this is the reason why we call logout() on each button press to allow user to switch their identity
  //   let identity = await this.props.scatter_state.login({ accounts: [EOS_NETWORK_MAINNET]})
  //   if (!identity) { return console.error(`No Scatter identity found on this network`)}

  //   const account = this.props.scatter_state.identity.accounts.find(x => x.blockchain === 'eos');
  //   if (account && account.name) {
  //     // Create eosJS client object
  //     let rpc = rpcMainnet
  //     const eosMainnet = this.props.scatter_state.eos(EOS_NETWORK_MAINNET, Api, {rpc, beta3:true})
  //     this.props.setEOS(eosMainnet)
  //     // Save user's account name (full account details are in account)
  //     this.props.setEosName(account.name)
  //   }
  // }

  componentWillUnmount = () => {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }

  // Return best [bid, ask] of minSize
  getInsideMarketDexeos = async (minSize) => {
    let quoteCurrency = this.props.quoteCurrency
    let baseCurrency = this.props.baseCurrency

    if (baseCurrency === "EOS") {
      let contractCode = "stablecarbon"
      let insideMarket = await getInvertedInsideMarket(contractCode, quoteCurrency, minSize)
      return insideMarket
    }
  }

  postOrders = async (price, amount, direction) => {
    let quoteCurrency = this.props.quoteCurrency
    let baseCurrency = this.props.baseCurrency
    let contractCode = "stablecarbon"
    let eosjsApi = this.props.eos_api
    let eosjsAccount = this.props.eos_name

    if (direction === "Buy") {
      // If customer wants to Buy EOS then they need to Sell CUSD quoted in EOS, 
      // So they will post an Ask to Dexeos API
      await postAsk(eosjsApi, eosjsAccount, amount, price, quoteCurrency, contractCode)
    } else if (direction === "Sell") {
      // If customer wants to Sell EOS then they need to Buy CUSD quoted in EOS, 
      // So they will post a Buy to Dexeos API

    } 
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });

    // Calculate and set inside market on orderTypeChange:
    if (name === "orderType") {
      let orderAmount = this.state.orderAmountOfCusd
      this.getInsideMarketDexeos(orderAmount).then(insideMarket => {
        let insideBid = insideMarket.bid
        let insideAsk = insideMarket.ask

        // If customer wants to buy, then need to find a willing seller
        // If customer wants to sell, needs to sell to a willing buyer
        if (event.target.value === "Buy") {
          if (insideAsk) {
            this.setState({
              insideMarket: insideAsk
            })
          } else {
            alert('Market cannot fulfill this order amount, please try again soon')
          }
        } else if (event.target.value === "Sell") {
          if (insideBid) {
            this.setState({
              insideMarket: insideBid
            })
          } else {
            alert('Market cannot fulfill this order amount, please try again soon')
          }
        }
      })
    }
  };

  handleSubmitEos = () => {
    alert('Sign the order transaction using Scatter to complete your order!')
    this.props.handleClose()
    this.postOrders(1/this.state.insideMarket, this.state.orderAmountOfCusd, this.state.orderType)
  }

  render() {
    const { 
      classes,
      open,
      handleClose,
      baseCurrency,
      quoteCurrency
    } = this.props;

    const disableSubmit = (
      ((this.state.orderType !== "Buy") && (this.state.orderType !== "Sell")) ||
      isNaN(this.state.insideMarket) ||
      !this.state.insideMarket ||
      this.state.insideMarket <= 0,
      isNaN(this.state.orderAmountOfCusd) ||
      !this.state.orderAmountOfCusd ||
      this.state.orderAmountOfCusd <= 0 
    )

    return (
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{baseCurrency}/{quoteCurrency} Order details</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Almost there! To complete your order, just fill out a few details
            </DialogContentText>
            <form className={classes.container} noValidate autoComplete="off">
              <TextField
                id="outlined-select-direction"
                select
                label="Order Type"
                className={classes.textField}
                value={this.state.orderType}
                onChange={this.handleChange('orderType')}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu,
                  },
                }}
                helperText={`Buy or Sell ${baseCurrency} with ${quoteCurrency}`}
                margin="normal"
                variant="outlined"
              >
                {orderTypes.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="outlined-number-orderAmountOfCusd"
                label="Order amount of CUSD"
                value={this.state.orderAmountOfCusd}
                onChange={this.handleChange('orderAmountOfCusd')}
                type="number"
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                variant="outlined"
              />
              <TextField
                id="outlined-read-only-input-bestPrice"
                label="Market price"
                value={this.state.insideMarket}
                className={classes.textField}
                margin="normal"
                type="number"
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button disabled={disableSubmit} onClick={this.handleSubmitEos} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

// @dev: Notes on "base" and "quote" currencies:
// In forex, currency pairs are written as XXX/YYY or simply XXXYYY. 
// Here, XXX is the base currency and YYY is the quote currency
SwapFormDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  quoteCurrency: PropTypes.string.isRequired,
  baseCurrency: PropTypes.string.isRequired
};

export default withRoot(connect(mapState, mapDispatch)(withStyles(styles)(SwapFormDialog)));

