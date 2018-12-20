import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Block from './Block';
import { Link } from 'react-router-dom';

class Blocks extends Component {
    state = { blocks: [], paginatedId: 1, blocksLength: 0 };

    componentDidMount() {
        fetch(`${document.location.origin}/api/blocks/length`)
            .then(response => response.json())
            .then(json => this.setState({ blocksLength: json }));
        this.fetchPaginatedBlocks(this.state.paginatedId)();
    }

    fetchPaginatedBlocks = paginatedId => () => {
        fetch(`${document.location.origin}/api/blocks/${paginatedId}`)
            .then(response => response.json())
            .then(json => this.setState({ blocks: json }));
    }

    render() {
        console.log(this.state);
        return (
            <div>
                <h2>Blocks</h2>
                <div>
                    <Link to='/'>Wallet</Link>
                </div>
                <div>
                    <Link to='/conduct-transaction'>Conduct a Transaction</Link>
                </div>
                <div className='mb-2'>
                    {
                        [...Array(Math.ceil(this.state.blocksLength / 10)).keys()].map(key => {
                            const paginatedId = key + 1;

                            return (
                                <span key={key} onClick={this.fetchPaginatedBlocks(paginatedId)}>
                                    <Button
                                        bsSize='small'
                                        bsStyle='primary'
                                    >
                                        {paginatedId}
                                    </Button>{' '}
                                </span>
                            )
                        })
                    }
                </div>
                {
                    this.state.blocks.slice(0).reverse().map(block => {
                        return (
                            <div key={block.hash} className='border border-primary rounded mb-3 p-2'>
                                <Block key={block.hash} block={block}/>
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

export default Blocks;