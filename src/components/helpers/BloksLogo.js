import React, { Component } from 'react';

class BloksLogo extends Component {

  render() {

    const bloks_io = (
      <img
        style={{ height: "20px", width: "auto" }}
        alt="Bloks.io"
        src="https://s3.amazonaws.com/carbon12/eoscafeblock.png"
      />
    );

    return (
      <React.Fragment>
          {bloks_io}
      </React.Fragment>
    );
  }
}

export default BloksLogo;
