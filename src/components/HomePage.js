import React, { Component } from 'react';
import withRoot from '../withRoot';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
// Core Wallet Components
import Networks from './homePageComponents/Networks'
import Accounts from './homePageComponents/Accounts'
import MintButton from './homePageComponents/MintButton'
import EosMint from './homePageComponents/EosMint'
import Balances from './homePageComponents/Balances'
import TransferButton from './homePageComponents/TransferButton'
import BurnButton from './homePageComponents/BurnButton'
import EosBurn from './homePageComponents/EosBurn'


const styles = theme => ({
});

// Redux mappings
const mapState = state => ({
  network: state.global.network
});

const mapDispatch = dispatch => ({
});

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }
  

  render() {
    const {
      network 
    } = this.props;

    return (

          <div>
            {/* NETWORK SELECTOR */}
              <Networks />
            {/* USER IDENTITY  */}
              <Accounts /> 
            {/* MINT */
              network == 0 ?
              <MintButton /> : <EosMint/>
            }
            {/* USER BALANCES  */
              network == 0 ?
              <Balances /> : <Balances />
            }
            {/* TRANSFER */
              network == 0 ?
              <TransferButton/> : ""
            }
            {/* BURN */
              network == 0 ?
              <BurnButton /> : ""//<EosBurn />
            }
          </div>
    );
  }
}

HomePage.propTypes = {
};

export default withRoot(connect(mapState, mapDispatch)(withStyles(styles)(HomePage)));
