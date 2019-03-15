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
  },
  section: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    textAlign: 'left'
  }
});

// Redux mappings
const mapState = state => ({
  eos_name: state.eos.user_name,
  eos_network: state.eos.network
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
      eos_network
    } = this.props;
    
    return (
        <div>
        <Paper className={classes.paper} elevation={3}>
            <Typography> 
                Swapping CUSD into another cryptocurrency on the EOS network is very simple (Ethereum and Tron cryptocurrencies will be available soon!)
            </Typography>
            <Typography variant="body1" className={classes.section}> 
                <b>1</b>: Sign in to an EOS Mainnet account. EOS DEX's currently only support the mainnet
            </Typography>
            <Typography variant="body1" className={classes.section}> 
                <b>2</b>: Select a currency that is currently listed against CUSD to swap into
            </Typography>
            <Typography variant="body1" className={classes.section}> 
                <b>3</b>: Fill out a short form and sign an EOS transaction through your wallet. Done!
            </Typography>
        </Paper>
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
                You are currently using the EOS network: <b>{eos_network}</b>
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
