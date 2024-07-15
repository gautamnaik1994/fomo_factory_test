import React from 'react';
import { useAppSelector } from '@/store/hooks';

type PriceDataProps = {
    symbol: string;
};


const PriceData = ({ symbol }: PriceDataProps): React.ReactNode => {
    
    const priceData = useAppSelector((state) => state.socket.priceData);

    return (
        <div>
            <h1>{ symbol }</h1>
            {priceData.map((data) => (
                <div key={data.date}>
                    <span>{data.date} : </span> <span>{data.price}</span>
                </div>
            ))}
        </div>
    );
}

export default PriceData;