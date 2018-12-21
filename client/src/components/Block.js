import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';

class Block extends Component {
    state = { displayTransaction: false };

    toggleTransaction = () => {
        const { data } = this.props.block;
        if (data.map) {
            this.setState({ displayTransaction: !this.state.displayTransaction });
        }
    }

    get displayTransaction() {
        const { data } = this.props.block;

        const stringifiedData = JSON.stringify(data);
    
        const dataDisplay = stringifiedData.length > 35 ?
            `${stringifiedData.substring(0, 35)}...`:
            stringifiedData;

        if (this.state.displayTransaction) {
            return (
                <div>
                    <h3>Data: </h3>
                    {
                        data.map(transaction => (
                            <div key={transaction.id}>
                                <hr />
                                <Transaction transaction={transaction} />
                            </div>
                        ))
                    }
                    <Button
                        bsStyle='success'
                        bsSize='small'
                        onClick={this.toggleTransaction}
                    >
                        Show Less
                    </Button>
                </div>
            )
        }

        return (
            <div>
                <h3>Data: </h3>
                <p>{dataDisplay}</p>
                <Button
                    bsStyle='success'
                    bsSize='small'
                    onClick={this.toggleTransaction}
                >
                    Show More
                </Button>
            </div>
        )
    }

    render() {
        const { timestamp, hash } = this.props.block;


        return (
            <div>
                <h3>Hash: </h3>
                <p>{hash}</p>
                <h3>Timestamp: </h3>
                <p>{new Date(timestamp).toLocaleString()}</p>
                {this.displayTransaction}
            </div>
        )
    }
}

export default Block;