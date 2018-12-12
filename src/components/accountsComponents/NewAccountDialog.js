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

// Redux state
import { connect } from "react-redux";
import { accountsActions, NETWORKS } from "../../store/accountsActions";

// ETH Account Management Helper functions
import createAccount_eth from '../../eth_services/createAccount'
import getJsonAddress from '../../eth_services/getJsonAddress'

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
    addEthAccount: newAccount => dispatch(accountsActions.addEthAccount(newAccount)),
});

class NewAccountDialog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            password: '',
            confirm_password: '',
            creating_account: false
        };
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    generateNewAccount = async () => {
        let network = this.props.network
        let account_password = this.state.password

        if (network === NETWORKS.ETH) {
            this.setState({
                creating_account: true
            })
            let new_account_json = await createAccount_eth(account_password)

            let new_eth_address = getJsonAddress(new_account_json)
            let new_account = {
                address: new_eth_address,
                json_encrypted: new_account_json
            }
            this.props.addEthAccount(new_account)
            this.setState({
                creating_account: false
            })
        }
        else if (network === NETWORKS.EOS) {
            alert('EOS account management not implemented yet!')
        } else {
            alert('Sorry, we do not support this network yet!')
        }

        // Close
        this.props.onCloseHandler()
        return
    }

    render() {

        const { 
            open, 
            onCloseHandler,
            classes
        } = this.props;
        const {
            password,
            confirm_password,
            creating_account
        } = this.state

        const validPassword = Boolean(password && confirm_password && (password === confirm_password))

        return (
            <div>
                <Dialog
                    open={open}
                    onClose={onCloseHandler}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Create new account</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Please enter a new password
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        onChange={this.handleChange('password')}
                        fullWidth
                    />
                    {password && 
                    (<TextField
                        margin="dense"
                        id="confirm-password"
                        label="Confirm Password"
                        type="password"
                        onChange={this.handleChange('confirm_password')}
                        fullWidth
                    />)}
                    </DialogContent>
                    <DialogActions>
                    {creating_account ? ("") : 
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
                        onClick={this.generateNewAccount} 
                        color="primary"
                        disabled={!validPassword}
                    >
                        Create
                    </Button>)}
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

NewAccountDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onCloseHandler: PropTypes.func.isRequired,
    network: PropTypes.number.isRequired,
};

export default connect(mapState, mapDispatch)(withRoot(withStyles(styles)(NewAccountDialog)));
