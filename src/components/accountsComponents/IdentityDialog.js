import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRoot from '../../withRoot';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

// REST API Calls
import saveUser from '../../db_services/saveUser'

// Redux state
import { connect } from "react-redux";
import { globalActions } from '../../store/globalActions';

// Helpers JSX
import Loading from '../helpers/Loading'

const styles = theme => ({
    facebook2: {
        color: '#6798e5',
        animationDuration: '550ms',
        position: 'absolute',
        left: 0,
    },
});
  
// Redux mappings
const mapState = state => ({
});
  
const mapDispatch = dispatch => ({
    setUsername: name => dispatch(globalActions.setUsername(name))
});

class IdentityDialog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            creating_account: false,
            openSignInDialog: false
        };
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    // Clear identity form
    clearForm = () => {
        this.setState({
            username: '',
            password: ''
        })
    }

    // Create a brand new identity
    generateNewAccount = async () => {
        let new_username = this.state.username
        let new_password = this.state.password

        // 1. Add username + password hash object to database if username doesn't exist
        let isValidAccount = Boolean(
            new_username && 
            new_password 
        )

        if (!isValidAccount) {
            alert('cannot create this account')
            return
        }

        // Save User to database
        try {
            this.setState({
                saving: true
            })
            let save_success = await saveUser(new_username, new_password)
            if (save_success) {
                // New account created
                this.props.setUsername(new_username)
                this.props.setUsername(new_username)
                this.clearForm()
                // Close
                this.props.onCloseHandler()
            } else {
                //Invalid account or user already exists
            }
            return
        } catch (err) {
            console.log('ERROR: could not save user data')
            this.setState({
                saving: false
            })
            return
        }
    }

    // Sign in to an existing identity 
    signInOldAccount = async () => {
        // 1. Try to log in with username+password on database
        let login_success = false
        if (!login_success) {
            alert('could not log in')
            return
        }
        // 2. Fetch username to global Redux state
            // This should also decrypt all encrypted wallet files with the user's password

        // Close
        this.props.onCloseHandler()
        return
    }

    // Switch between sign in and new account dialogs
    toggleSignInDialog = () => {
        let showSignIn = this.state.openSignInDialog
        this.setState({
            openSignInDialog: !showSignIn
        })
    }

    render() {

        const { 
            open, 
            onCloseHandler,
            classes
        } = this.props;
        const {
            username,
            password,
            creating_account,
            openSignInDialog
        } = this.state

        const canCreateNew = Boolean(username && password)
        const canSignIn = Boolean(username && password)

        return (
            <div>
                <Dialog
                    open={open}
                    onClose={onCloseHandler}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Accounts</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        <FormControlLabel
                            control={
                            <Switch
                                checked={openSignInDialog}
                                onChange={this.toggleSignInDialog}
                                value="openSignInDialog"
                                color="primary"
                            />
                            }
                            label="Already have an account?"
                        />
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="username"
                        label="Username"
                        type="name"
                        onChange={this.handleChange('username')}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        onChange={this.handleChange('password')}
                        fullWidth
                    />
                    </DialogContent>
                    <DialogActions>
                    {creating_account ? (<Loading />) : 
                    (<Button onClick={onCloseHandler} color="primary">
                        Nevermind
                    </Button>)}
                    {creating_account ? 
                    (<Button
                        disabled
                        color="primary"
                    >
                        <CircularProgress
                            variant="indeterminate"
                            disableShrink
                            className={classes.facebook2}
                            size={24}
                            thickness={4}
                        />
                    </Button>)
                    : 
                    (<Button 
                        onClick={openSignInDialog ? this.signInOldAccount : this.generateNewAccount} 
                        color="primary"
                        disabled={openSignInDialog ? !(canSignIn) : !(canCreateNew) }
                    >
                        {openSignInDialog ? "Sign in" : "Create"}
                    </Button>)}
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

IdentityDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onCloseHandler: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatch)(withRoot(withStyles(styles)(IdentityDialog)));
