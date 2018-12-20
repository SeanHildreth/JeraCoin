import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';

class ConductTransaction extends Component {
    state = { recipient: '', amount: 0 };

    updateRecipient = event => {
        this.setState({ recipient: event.target.value });
    }

    updateAmount = event => {
        this.setState({ amount: Number(event.target.value) });
    }

    conductTransaction = () => {
        const { recipient, amount } = this.state;

        fetch(`${document.location.origin}/api/transact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipient, amount })
        }).then(res => res.json())
            .then(json => {
                alert(json.message || json.type);
                history.push('/transaction-pool');
            });
    }

    render() {
        return (
            <div className='container'>
                <h2>Conduct A Transaction</h2>
                <div>
                    <Link to='/'>Wallet</Link>
                </div>
                <div>
                    <Link to='/transaction-pool'>Transaction Pool</Link>
                </div>
                <div>
                    <h3>Recipient's Address: </h3>
                    <FormGroup>
                        <FormControl 
                            input='text'
                            placeholder='Recipient'
                            value={this.state.recipient}
                            onChange={this.updateRecipient}
                        />
                    </FormGroup>
                </div>
                <div>
                    <h3>Amount: </h3>
                    <FormGroup>
                        <FormControl 
                            input='number'
                            value={this.state.amount}
                            onChange={this.updateAmount}
                        />
                    </FormGroup>
                </div>
                <Button
                    bsStyle='success'
                    bsSize='large'
                    onClick={this.conductTransaction}
                >
                    Conduct the Transaction
                </Button>
            </div>
        )
    };
}

export default ConductTransaction;