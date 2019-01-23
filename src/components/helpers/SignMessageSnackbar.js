import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar'
import PropTypes from 'prop-types';
class SignMessageSnackbar extends Component {
    render () {
        const {
            open
        } = this.props

        return (
            <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                open={open}
                autoHideDuration={3000}
                ContentProps={{
                'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">Please sign the transaction</span>}
            />
        );
    }
}

SignMessageSnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default SignMessageSnackbar;
