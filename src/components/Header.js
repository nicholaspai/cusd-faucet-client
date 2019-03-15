import React, { Component } from 'react';
import withRoot from '../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';


// Redux state
import { connect } from "react-redux";
import { globalActions, PAGES } from '../store/globalActions'

// Custom Components
import HeaderMenu from './headerComponents/HeaderMenu'
import LoginWeb3 from './headerComponents/LoginWeb3'

const styles = theme => ({
  grow: {
    flexGrow: 1,
  },
});

const mapState = state => ({
  user_address: state.eth.user_address,
  network: state.global.network,
  user_address_tron: state.tron.user_address
})

const mapDispatch = dispatch => ({
  setPage: NUMBER => dispatch(globalActions.setPage(NUMBER))
});

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }
  
  goToMainPage = () => {
      this.props.setPage(PAGES.MAIN)
  }
  
  render() {
    const { 
      classes, 
      user_address,
      network,
      user_address_tron
    } = this.props;

    const short_name = user_address ? user_address.substring(0,8) : ""
    const short_name_tron = user_address_tron ? user_address_tron.base58.substring(0,8) : ""

    return (
        <AppBar position="static">
          <Toolbar>
            <HeaderMenu />
            <Typography variant="h6" color="inherit" className={classes.grow}>
                CUSD Faucet 
                <Button 
                  onClick={this.goToMainPage}
                >
                  <span role="img" aria-label="Sake">
                  🍶
                  </span>
                </Button> 
                {network === 0 && short_name}
                {network === 2 && short_name_tron}
            </Typography>
            {/* REQUEST USER SIGNATURE */}
            <LoginWeb3 />
          </Toolbar>
        </AppBar>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(mapState, mapDispatch)(withRoot(withStyles(styles)(Header)));
