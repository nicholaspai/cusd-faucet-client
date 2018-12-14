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
import loginUser from '../../db_services/loginUser'

// Redux state
import { connect } from "react-redux";
import { globalActions } from '../../store/globalActions';
import { NETWORKS } from '../../store/accountsActions'

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
    setUsername: name => dispatch(globalActions.setUsername(name)),
    setPassword: password => dispatch(globalActions.setPassword(password))
});

class IdentityDialog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            confirm_password: '',
            loading_server: false,
            openSignInDialog: false
        };
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    // Create a brand new identity
    generateNewAccount = async () => {
        let username = this.state.username
        let password = this.state.password
        let confirm_password = this.state.confirm_password

        let isValidAccount = Boolean(
            username && 
            password &&
            confirm_password &&
            (password === confirm_password)
        )
        if (!isValidAccount) {
            alert('cannot create this account')
            return
        }

        // Attempt to create new user
        try {
            this.setState({
                loading_server: true
            })
            let new_user = await saveUser(username, password)
            if (new_user) {
                // Successfully created new user
                let new_username = new_user.user
                console.log('created a new user: ', new_username)
                // Now, "sign in" new user
                this.props.setUsername(username)
                this.props.setPassword(password)
                // Close
                this.props.onCloseHandler()
            }
            this.setState({
                loading_server: false
            })

            return
        } catch (err) {
            console.log('ERROR: could not save user data')
            this.setState({
                loading_server: false
            })
            return
        }
    }

    // Sign in to an existing identity 
    signInOldAccount = async () => {
        let username = this.state.username
        let password = this.state.password


        // Attempt to get existing user
        try {
            this.setState({
                loading_server: true
            })
            let existing_user = await loginUser(username, password)
            if (existing_user) {
                // Successfully logged in new user
                let existing_username = existing_user.user
                let existing_password = existing_user.password
                let existing_wallets = existing_user.wallets

                console.log('signed in existing user: ', existing_username)
                // Now, "sign in" new user
                this.props.setUsername(existing_username)
                this.props.setPassword(existing_password)

                // Set user accounts
                let eth_accounts = existing_wallets[NETWORKS.ETH]
                console.log('user eth accounts: ', eth_accounts)
                console.log('number of user eth accounts: ', eth_accounts.length)

                // Close
                this.props.onCloseHandler()
            }
            this.setState({
                loading_server: false
            })

            return
        } catch (err) {
            console.log('ERROR: could not sign in user')
            this.setState({
                loading_server: false
            })
            return
        }
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
            confirm_password,
            loading_server,
            openSignInDialog
        } = this.state

        const canCreateNew = Boolean(username && password && confirm_password && (password === confirm_password))
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
                    {!openSignInDialog ? (<TextField
                        margin="dense"
                        id="confirm-password"
                        label="Confirm Password"
                        type="password"
                        onChange={this.handleChange('confirm_password')}
                        fullWidth
                    />) : ("")}
                    </DialogContent>
                    <DialogActions>
                    {loading_server ? (<Loading />) : 
                    (<Button onClick={onCloseHandler} color="primary">
                        Nevermind
                    </Button>)}
                    {loading_server ? 
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
