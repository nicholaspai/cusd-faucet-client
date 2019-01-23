import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRoot from '../../withRoot';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress'

// Redux state
import { connect } from "react-redux";
import { accountsActions, NETWORKS } from "../../store/accountsActions";

// ETH Account Management Helper functions
import createAccount_eth from '../../eth_services/createAccount'

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
    addEthAccount: newAccount => dispatch(accountsActions.addEthAccount(newAccount)),
});

class NewEthAccountDialog extends Component {

    constructor(props) {
        super(props);

        this.state = {
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

        if (network === NETWORKS.ETH) {
            this.setState({
                creating_account: true
            })
            let new_account_json = await createAccount_eth()

            this.props.addEthAccount(new_account_json)
            this.setState({
                creating_account: false
            })
        }
        else if (network === NETWORKS.EOS) {
            alert('EOS account management coming imminently')
        } else {
            alert('Sorry, we are looking to implement this network soon!')
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
            creating_account
        } = this.state

        return (
            <div>
                <Dialog
                    open={open}
                    onClose={onCloseHandler}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Create new burner wallet?</DialogTitle>
                    <DialogContent>
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
                        onClick={this.generateNewAccount} 
                        color="primary"
                    >
                        Create
                    </Button>)}
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

NewEthAccountDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onCloseHandler: PropTypes.func.isRequired,
    network: PropTypes.number.isRequired,
};

export default connect(mapState, mapDispatch)(withRoot(withStyles(styles)(NewEthAccountDialog)));
