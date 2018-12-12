import React, { Component } from 'react';
import withRoot from '../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar';

// Redux state
import { connect } from "react-redux";

// Custom Components
import HeaderMenu from './headerComponents/HeaderMenu'
import LoginEthereum from './headerComponents/LoginEthereum'

const styles = theme => ({
  grow: {
    flexGrow: 1,
  },
});

const mapState = state => ({
})

const mapDispatch = dispatch => ({
});

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }
  
  render() {
    const { classes } = this.props;

    return (
        <AppBar position="static">
          <Toolbar>
            <HeaderMenu />
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Ropsten Faucet <span role="img" aria-label="Sake">🍶</span>
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
