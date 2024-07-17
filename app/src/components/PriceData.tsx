import React, { use } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useAppDispatch } from '@/store/hooks';
import { togglePopup } from '@/reducers/popupSlice';

type PriceData = {
    timestamp: string;
    price: number;
}[]

const PriceData = (): React.ReactNode => {

    const dispatch = useAppDispatch();
    
    const { priceData, value, updateId }: { priceData: PriceData, value: string , updateId: number} = useAppSelector((state) => state.socket);
    
    return (
        <div className={`price-data updated-${updateId}`}>
            <div className='symbol-info'>
                <h1>{value}</h1>
                <button onClick={ () => dispatch(togglePopup())}>Select symbol</button>
            </div>
            
            
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