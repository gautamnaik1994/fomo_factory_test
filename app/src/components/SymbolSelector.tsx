import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { subscribe } from '@/reducers/socketSlice';

const symbols=["ETH", "BTC", "GRIN", "XRP", "LTC"]

const SymbolSelector: React.FC = () => {
    const [open, setOpen] = useState(false);

    const dispatch = useAppDispatch();


    return (
        <>
            <button onClick={() => setOpen(!open)}>Select Symbol</button>
            {
                open && (
                    <div>
                        {symbols.map((symbol) => (
                            <button key={symbol} onClick={() => dispatch(subscribe(symbol))}>{symbol}</button>
                        ))}
                    </div>
                )
            }

        </>
    );
};

export default SymbolSelector;
