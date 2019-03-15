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
  eos_name: state.eos.user_name,
  eos_client: state.global.eos_client
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
      eos_name,
      eos_client
    } = this.props;
    
    return (
        <div>
        <Paper className={classes.paper} elevation={3}>
            <Typography> 
                You are connected to EOS as: {eos_name ? (<a
                    href={"https://jungle.bloks.io/account/" + eos_name}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    {eos_name}
                    </a>) : ("")} <b> Please ensure that this is your mainnet account!</b>
              </Typography>
        </Paper>
        <Paper className={classes.paper} elevation={3}>
            <Typography> 
                You are currently using the EOS network: {eos_client ? (eos_client.rpc.endpoint) : ""}
            </Typography>
        </Paper>
        </div>
    )
  }
}

Accounts.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(connect(mapState, mapDispatch)(withStyles(styles)(Accounts)));
