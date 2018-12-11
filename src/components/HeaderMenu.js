import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Info from '@material-ui/icons/Info';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

// Redux state
import { connect } from "react-redux";
import { globalActions, PAGES } from "../store/globalActions";

const styles = {
};

const mapState = state => ({
  page: state.global.page
})

const mapDispatch = dispatch => ({
  setPage: number => dispatch(globalActions.setPage(number))
});

class HeaderMenu extends React.Component {
  state = {
    anchorEl: null,
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  goToMainPage = () => {
      this.props.setPage(PAGES.MAIN)
  }

  goToInfoPage = () => {
      this.props.setPage(PAGES.INFO)
  }

  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
        <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <Info />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.goToMainPage}>Home</MenuItem>
                  <MenuItem onClick={this.goToInfoPage}>Information</MenuItem>
                </Menu>
        </div>

    );
  }
}

HeaderMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapState, mapDispatch)(withStyles(styles)(HeaderMenu));