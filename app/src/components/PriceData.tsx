import React, { use } from 'react';
import { useAppSelector } from '@/store/hooks';

type PriceData = {
    timestamp: string;
    price: number;
}[]


const PriceData = (): React.ReactNode => {
    
    const { priceData, value }: { priceData: PriceData, value: string } = useAppSelector((state) => state.socket);
    

    return (
        <div className='price-data'>
            <h1>{value}</h1>
            
            <table>
                <thead>
                    <tr>
                        <th align='left'>Date</th>
                        <th align='center'>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {priceData.map((data) => (
                        <tr key={data.timestamp}>
                            <td>{data.timestamp}</td>
                            <td align='center'>{data.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
           
        </div>
    );
}

export default PriceData;