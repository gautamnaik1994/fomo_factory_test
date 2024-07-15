import React from 'react';
import { useAppSelector } from '@/store/hooks';

type PriceData = {
    timestamp: string;
    price: number;
}[]


const PriceData = (): React.ReactNode => {
    
    const {priceData, value}: { priceData: PriceData, value: string } = useAppSelector((state) => state.socket);

    return (
        <div>
            <h1>{value}</h1>
            
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {priceData.map((data) => (
                        <tr key={data.timestamp}>
                            <td>{data.timestamp}</td>
                            <td>{data.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
           
        </div>
    );
}

export default PriceData;