import React, { useState } from 'react';
import moment from 'moment';
import FlightCard from './FlightCard';
import '../styles/_flights-list.scss';

const FlightsList = props => {
    const [visible, setVisible] = useState(2);

    const loadMore = () => {
        setVisible(visible+4);
    }

    return (
        <div className='main'>
            {props.results && props.results.slice(0, visible).map((res, index) => (
                    <div key={index} className={`box-item${index}`}>
                        <FlightCard
                            route={res.route}
                            fly_duration={res.fly_duration}
                            price={res.conversion.EUR}
                        />
                    </div>       
                    ))}
            {props.results && visible < props.results.length &&
                <button onClick={loadMore} type="button" className="load-more">Load more</button>
            }
        </div>
    );
};

export default FlightsList;