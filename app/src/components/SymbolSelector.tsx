import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { subscribe } from '@/reducers/socketSlice';
import { togglePopup } from '@/reducers/popupSlice';

const symbols = ["ETH", "BTC", "GRIN", "XRP", "LTC"]

const SymbolSelector: React.FC = () => {

    const dispatch = useAppDispatch();
    const open = useAppSelector((state) => state.popup.open);

    if (open) {
        return (
            <div className='popup-overlay'>
                <div className='popup'  >
                    <ul className='symbol-list'>
                        {symbols.map((symbol) => (
                            <li key={symbol}>
                                <span>{symbol}</span>
                                <button key={symbol} onClick={() => {
                                    dispatch(subscribe(symbol));
                                    dispatch(togglePopup())
                                }}>Subscribe</button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => dispatch(togglePopup())}>Close</button>
                </div>
            </div>
        );
    }


};

export default SymbolSelector;
