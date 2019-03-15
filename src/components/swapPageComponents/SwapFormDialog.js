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
import { getInvertedInsideMarket, postAsk, postBid } from '../../exchange_services/dexeos'

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
  eos_network: state.eos.network
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
    await this.checkScatterConnection()
    await this.updateInsideMarket(this.state.orderAmountOfCusd, this.state.orderType)
  }
  
  /** Save Scatter object for the first time if possible */
  checkScatterConnection = async () => {
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
    let eos_network = this.props.eos_network

    if (eos_network !== "mainnet") {
      alert('Please connect an EOS mainnet account to continue')
      return;
    }

    if (direction === "Buy") {
      // If customer wants to Buy EOS then they need to Sell CUSD quoted in EOS, 
      // So they will post an Ask to Dexeos API
      await postAsk(eosjsApi, eosjsAccount, amount, price, quoteCurrency, contractCode)
    } else if (direction === "Sell") {
      // If customer wants to Sell EOS then they need to Buy CUSD quoted in EOS, 
      // So they will post a Buy to Dexeos API
      await postBid(eosjsApi, eosjsAccount, amount, price, quoteCurrency, contractCode)
    } 
  }

  updateInsideMarket = async (orderAmount, orderType) => {
    this.getInsideMarketDexeos(orderAmount).then(insideMarket => {
        let insideBid = insideMarket.bid
        let insideAsk = insideMarket.ask

        // If customer wants to buy, then need to find a willing seller
        // If customer wants to sell, needs to sell to a willing buyer
        if (orderType === "Buy") {
          if (insideAsk) {
            this.setState({
              insideMarket: insideAsk
            })
          } else {
            this.setState({
              insideMarket: "order size too large"
            })
          }
        } else if (orderType === "Sell") {
          if (insideBid) {
            this.setState({
              insideMarket: insideBid
            })
          } else {
            this.setState({
              insideMarket: "order size too large"
            })
          }
        }
      })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSubmitEos = async () => {
    await this.postOrders(1/this.state.insideMarket, this.state.orderAmountOfCusd, this.state.orderType)
    this.props.handleClose()
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
              Almost there! To complete your order, just fill out a few details. 
              Ensure that you have the order type correct. 
              If you select "Buy", then you are buying EOS by selling CUSD.
              If you select "Sell", then you are selling EOS by buying CUSD.
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

