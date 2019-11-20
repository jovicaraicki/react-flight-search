import React, { useContext } from 'react';
import moment from 'moment';
import Context from '../context/Context';
import '../styles/_flight-card.scss';

const FlightCard = props => {
    const { state } = useContext(Context);
    const { airlines } = state;

    return (
        <div className='flight-card row'>
            <div className='col-8'> 
            {props.route.map((r, index) => (
                <div key={index} className='rental-detail-link'>
                    <div className='bwm-card'>
                        <div className='card-block'>
                            <div className={`card-subtitle departure`}><span>{moment.unix(r.dTimeUTC).format('HH:mm')}</span> <span>{r.cityFrom}</span> {r.flyFrom}</div>
                            <div className='card-title'><span className='duration'>{moment.utc(moment.unix(r.aTimeUTC).diff(moment.unix(r.dTimeUTC))).format('HH[h] mm[m]')}</span><span className='airline'> {airlines && airlines.map(line => line.code === r.airline && line.name)}</span></div>
                            <div className={`card-subtitle arrival`}><span>{moment.unix(r.aTimeUTC).format('HH:mm')}</span> <span>{r.cityTo}</span> {r.flyTo}</div>
                            <p className='card-text'></p>
                        </div>
                    </div>
                </div>
            ))}
            </div>
            <div className='col-4'>{props.price}€</div>
        </div>
    );
};

export default FlightCard;