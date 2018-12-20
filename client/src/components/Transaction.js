import React from 'react';

const Transaction = ({ transaction }) => {
    const { input, outputMap } = transaction;
    const recipients = Object.keys(outputMap);

    return (
        <div>
            <div>
                <h3 className='d-inline'>Balance: </h3><p className='d-inline'>{input.amount}</p>
                <h3 className='d-inline ml-5'>From: </h3><p>{input.address}</p>
            </div>
            {
                recipients.map(recipient => (
                    <div key={recipient}>
                        <h3 className='d-inline'>Sent: </h3><p className='d-inline'>{outputMap[recipient]}</p>
                        <h3 className='d-inline ml-5'>To: </h3><p>{recipient}</p>
                    </div>
                ))
            }
        </div>
    );
}

export default Transaction;