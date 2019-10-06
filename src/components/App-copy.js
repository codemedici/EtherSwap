import React, { Component } from 'react'
import './App.css'
import './CandleStickChart.css'
import Navbar from './Navbar'
import Content from './Content'
import { connect } from 'react-redux'
import {
  loadWeb3,
  loadAccount,
  loadToken,
  loadExchange
} from '../store/interactions'
import { contractsLoadedSelector } from '../store/selectors'
// imports for candlestick chart
import * as d3 from 'd3';
import * as d3queue from 'd3-queue';
import * as topojson from 'topojson';
/* Add these to package.json
    "d3": "3.5.17",
    "d3-queue": "3.0.7",
    "topojson": "3.0.2"
*/

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    const web3 = loadWeb3(dispatch)
    await web3.eth.net.getNetworkType()
    const networkId = await web3.eth.net.getId()
    await loadAccount(web3, dispatch)
    const token = await loadToken(web3, networkId, dispatch)
    if(!token) {
      window.alert('Token smart contract not detected on the current network. Please select another network with Metamask.')
      return
    }
    const exchange = await loadExchange(web3, networkId, dispatch)
    if(!exchange) {
      window.alert('Exchange smart contract not detected on the current network. Please select another network with Metamask.')
      return
    }
  }

  render() {
    return (
      <div>
        <script src="cschart.js"></script>
        <script src="csbars.js"></script>
        <script src="csheader.js"></script>
        <script src="csdataprep.js"></script>
        <script src="csmain.js"></script>
        <Navbar />
        { this.props.contractsLoaded ? <Content /> : <div className="content"></div> }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    contractsLoaded: contractsLoadedSelector(state)
  }
}

export default connect(mapStateToProps)(App)
