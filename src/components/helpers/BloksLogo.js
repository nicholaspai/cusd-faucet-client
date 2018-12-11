import React, { Component } from 'react';

class BloksLogo extends Component {

  render() {

    const bloks_io = (
      <img
        style={{ height: "20px", width: "auto" }}
        alt="Bloks.io"
        src="https://eoscafeblock.com/cafe_logo_256.png"
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
