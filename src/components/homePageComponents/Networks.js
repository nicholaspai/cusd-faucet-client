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

//scatter
//import * as Eos from 'eosjs'
//import ScatterJS from 'scatterjs-core';
//import ScatterEOS from 'scatterjs-plugin-eosjs2';
//import {JsonRpc, Api} from 'eosjs';
import EOSIOClient from "../../eos_services/setupEos"

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
  eos_client: state.global.eos_client,
  network: state.global.network,
  scatter_state: state.eos.scatter_state
});

const mapDispatch = dispatch => ({
  setNetwork: NETWORK => dispatch(globalActions.setNetwork(NETWORK)),
  setEOS:  client => dispatch(globalActions.setEOS(client)),
  setScatterState: string => dispatch(eosActions.setScatterState(string))

});


class Networks extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  // Refresh user CUSD balance
  _checkScatterConnection = async () => {
      
      if (this.props.eos_client) {
        if((this.props.eos_client.noScatter == true) && (this.props.scatter_state =='') ){
          this.props.setScatterState("MISSING")
          clearInterval(this.state.intervalId);

        } 
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

    if (this.props.network == "1"){
      // Update user balance
      
      await this._checkScatterConnection()
    } 
  }

  componentWillUnmount = () => {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }
  

  handleChange = name => event => {
    var current = event.target.value;
    
    this.props.setNetwork(current);
    if (current === "1"){
      //EOS
      if (!this.props.eos_client){
        
          this.eosio =  new EOSIOClient("CARBON_OASIS")//new EOSIOClient("CARBON_OASIS");
        
          this.props.setEOS(this.eosio)
       
      } 
    } 
    else if (current === "0") {
      //ETH
      
    }
    else {
      
      throw (Error("No network"))

      
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
                    onChange={this.handleChange('age')}
                    inputProps={{
                    name: 'age',
                    id: 'age-native-simple',
                    }}
                >
                    <option value={NETWORKS.ETH}>ETH</option>
                    <option value={NETWORKS.EOS}>EOS</option>
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