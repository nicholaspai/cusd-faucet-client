import React, { Component } from 'react';
import withRoot from '../../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

// Redux state
import { connect } from "react-redux";

const styles = theme => ({
  paper: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 1,
    marginLeft: theme.spacing.unit * 5,
    marginRight: theme.spacing.unit * 5,
  }
});

// Redux mappings
const mapState = state => ({
  eth_address: state.eth.user_address
});

const mapDispatch = dispatch => ({
});

class Accounts extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {

    const { 
      classes, 
      eth_address, 
    } = this.props;

    const user_short = eth_address ? eth_address.substring(0, 8) : "" 

    return (
        <Paper className={classes.paper} elevation={3}>
            <Typography> 
                You are connected to Ethereum as: 
                    {eth_address ? (<a
                    href={"https://ropsten.etherscan.io/address/" + eth_address}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    {user_short}...
                    </a>) : ("")}
            </Typography>
        </Paper>
    )
  }
}

Accounts.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(connect(mapState, mapDispatch)(withStyles(styles)(Accounts)));
