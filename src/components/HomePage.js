import React, { Component } from 'react';
import withRoot from '../withRoot';

// Material-ui
import { withStyles } from '@material-ui/core/styles';

// Core Wallet Components
import Accounts from './homePageComponents/Accounts'
import MintButton from './homePageComponents/MintButton'
import Balances from './homePageComponents/Balances'
import TransferButton from './homePageComponents/TransferButton'
import BurnButton from './homePageComponents/BurnButton'

const styles = theme => ({
});

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {

    return (
          <div>
            {/* USER IDENTITY  */}
            <Accounts />
            {/* MINT */}
            <MintButton />
            {/* USER BALANCES  */}
            <Balances />
            {/* TRANSFER */}
            <TransferButton />
            {/* BURN */}
            <BurnButton />
          </div>
    );
  }
}

HomePage.propTypes = {
};

export default withRoot(withStyles(styles)(HomePage));
