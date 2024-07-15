import { useSocket } from '@/context/socketContext';
import React, { useState, useEffect } from 'react';

const SymbolSelector: React.FC = () => {
    const [symbol, setSymbol] = useState('BTC');
    const [open, setOpen] = useState(false);

    return (
        <>
            <button onClick={() => setOpen(!open)}>Select Symbol</button>
            {
                open && (
                    <div>
                        <button onClick={() => setSymbol('BTC')}>BTC</button>
                        <button onClick={() => setSymbol('ETH')}>ETH</button>
                        <button onClick={() => setSymbol('DOGE')}>DOGE</button>
                    </div>
                )
            }


        </>
    );
};

export default SymbolSelector;
