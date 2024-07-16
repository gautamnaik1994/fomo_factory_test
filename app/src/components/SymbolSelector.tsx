import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { subscribe } from '@/reducers/socketSlice';

const symbols = ["ETH", "BTC", "GRIN", "XRP", "LTC"]

const SymbolSelector: React.FC = () => {
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();

    return (
        <>
            <button onClick={() => setOpen(!open)}>Select Symbol</button>
            {
                open && <>
                    <div className='popup-overlay'>
                        <div className='popup'  >
                            <ul className='symbol-list'>
                                {symbols.map((symbol) => (
                                    <li key={symbol}>
                                        <span>{symbol}</span>
                                        <button key={symbol} onClick={() => {
                                            dispatch(subscribe(symbol));
                                            setOpen(false);
                                        } }>Subscribe</button>
                                    </li>
                                ))}
                            </ul>

                            <button onClick={() => setOpen(false)}>Close</button>
                        </div>
                    </div>

                </>
            }

        </>
    );
};

export default SymbolSelector;
