import React, { Component } from 'react';

class EtherscanLogo extends Component {

  render() {

    const etherscan = (
      <img
        style={{ height: "20px", width: "auto" }}
        alt="Etherscan"
        src="https://db5islsn2p9x4.cloudfront.net/etherscan.png"
      />
    );

    return (
      <React.Fragment>
          {etherscan}
      </React.Fragment>
    );
  }
}

export default EtherscanLogo;
