import React, { Component } from 'react';
import withRoot from '../withRoot';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
// Core Wallet Components
import Networks from './homePageComponents/Networks'
import Accounts from './homePageComponents/Accounts'
import MintButton from './homePageComponents/MintButton'
import EosMint from './homePageComponents/eos/MintButton'
import TelosMint from './homePageComponents/telos/MintButton'
import TronMint from './homePageComponents/tron/MintButton'
import Balances from './homePageComponents/Balances'
import TransferButton from './homePageComponents/TransferButton'
import TronTransfer from './homePageComponents/tron/TransferButton'
import BurnButton from './homePageComponents/BurnButton'
import EosBurn from './homePageComponents/eos/BurnButton'
import EosTransfer from './homePageComponents/eos/TransferButton'
import TronBurn from './homePageComponents/tron/BurnButton'


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
            {/* MINT  */
              network === 0 ?
              <MintButton /> : 
              ( network === 1 ? <EosMint/> :
                (network === 2 ? <TronMint /> : 
                  (network === 3 ? <TelosMint /> : "" )
                )
              )
            }
            {/* USER BALANCES  */
              network === 0 ?
              <Balances /> : <Balances />
            }
            {/* TRANSFER */
              network === 0 ?
              <TransferButton/> : 
              ( network === 1 ? <EosTransfer/> :
                (network === 2 ? <TronTransfer /> : "" )
              )
            }
            {/* BURN */
              network === 0 ?
              <BurnButton /> : 
              ( network === 1 ? <EosBurn/> :
                (network === 2 ? <TronBurn /> : "" )
              )
            }
          </div>
    );
  }
}

HomePage.propTypes = {
};

export default withRoot(connect(mapState, mapDispatch)(withStyles(styles)(HomePage)));
