import React, { Component } from 'react';
import withRoot from '../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

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

class SwapPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {

    const { 
      classes, 
    } = this.props;

    return (
        <div>
        <Paper className={classes.paper} elevation={3}>
            <Typography variant="body1" className={classes.section}> 
                <b>(Beta)</b> Swap CUSD with any cryptocurrency on our supported networks
            </Typography>
            <Button variant="contained" className={classes.section}> 
                EOS
            </Button>
        </Paper>
        </div>
    )
  }
}

SwapPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(SwapPage));
