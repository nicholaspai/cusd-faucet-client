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
import LoginEthereum from './headerComponents/LoginEthereum'

const styles = theme => ({
  grow: {
    flexGrow: 1,
  },
});

const mapState = state => ({
  user_address: state.eth.user_address
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
      user_address 
    } = this.props;

    const short_name = user_address ? user_address.substring(0,8) : ""

    return (
        <AppBar position="static">
          <Toolbar>
            <HeaderMenu />
            <Typography variant="h6" color="inherit" className={classes.grow}>
                Ropsten Faucet 
                <Button 
                  onClick={this.goToMainPage}
                >
                  <span role="img" aria-label="Sake">
                  🍶
                  </span>
                </Button> 
                {short_name}
            </Typography>
            {/* REQUEST USER SIGNATURE */}
            <LoginEthereum />
          </Toolbar>
        </AppBar>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(mapState, mapDispatch)(withRoot(withStyles(styles)(Header)));
