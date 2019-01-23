import React, { Component } from 'react';
import withRoot from '../../withRoot';
import PropTypes from 'prop-types';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'

// Redux state
import { connect } from "react-redux";
import { globalActions, NETWORKS } from "../../store/globalActions";

const styles = theme => ({
  paper: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 1,
    marginLeft: theme.spacing.unit * 5,
    marginRight: theme.spacing.unit * 5,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

// Redux mappings
const mapState = state => ({
});

const mapDispatch = dispatch => ({
  setNetwork: NETWORK => dispatch(globalActions.setNetwork(NETWORK))
});


class Networks extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  handleChange = name => event => {
    this.props.setNetwork(event.target.value);
  };

  render() {

    const { 
      classes
    } = this.props;

    return (
        <div>
        <Paper className={classes.paper} elevation={3}>
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="network-selector">Network</InputLabel>
                <Select
                    native
                    value={this.state.age}
                    onChange={this.handleChange('age')}
                    inputProps={{
                    name: 'age',
                    id: 'age-native-simple',
                    }}
                >
                    <option value={NETWORKS.ETH}>ETH</option>
                    <option value={NETWORKS.EOS}>EOS</option>
                </Select>
            </FormControl>
        </Paper>
        </div>
    )
  }
}

Networks.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapState, mapDispatch)(withRoot(withStyles(styles)(Networks)));
