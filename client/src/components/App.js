import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class App extends Component {
    state = { walletInfo: {} };

    componentDidMount() {
        fetch(`${document.location.origin}/api/wallet-info`)
            .then(response => response.json())
            .then(json => this.setState({ walletInfo: json }));
    }

    render() {
        const { address, balance } = this.state.walletInfo;

        return (
            <div>
                <div className='row'>
                    <div className='col w-25'></div>
                    <div className='p-2 border border-primary rounded col w-50'>
                        <h3>Address: </h3><p className='bg-light text-dark border border-dark rounded lead' id='address'>{address}</p>
                        <h3>Balance: </h3><p className='bg-light text-dark border border-dark rounded lead'>{balance}</p>
                    </div>
                    <div className='col w-25'></div>
                </div>
                <div>
                    <Link to='/blocks'>Blocks</Link>
                </div>
                <div>
                    <Link to='/conduct-transaction'>Conduct a Transaction</Link>
                </div>
                <div>
                    <Link to='/transaction-pool'>Transaction Pool</Link>
                </div>
            </div>
        );
    }
}

export default App;