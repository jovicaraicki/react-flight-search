import React, { useContext } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Context from './context/Context';
import './App.css';
import Header from './components/Header';
import SearchFlights from './components/SearchFlights';
import FlightsList from './components/FlightsList';
import Footer from './components/Footer';

function App() {
    const { state, dispatch } = useContext(Context);
    const { results, spinnerOn } = state;

    const updateResults = (results) => {
        dispatch({ type: 'GET_RESULTS', payload: results });
        getAirlines();
    }
    
    const toggleSpinnerState = () => {
        dispatch({ type: 'SET_SPINNER', payload: !spinnerOn });
    }
    
    const getAirlines = async () => {
        await fetch(`${process.env.REACT_APP_NODE_SERVER}/airlines`)
        .then(res => res.json())
        .then((data) => {
            dispatch({ type: 'GET_AIRLINES', payload: data.airlines });
        });
    };
      
  return (
    <div className="App">
      <main>
          <div className='box1'>
              <Header />
          </div>
          <div className='box2'>
          </div>
          <div className='box3'>
              <SearchFlights 
                results={results}
                updateResults={updateResults}
                toggleSpinnerState={toggleSpinnerState}
              />
          </div>
          <div className='box4'>
              {/* <img src='https://d2slcw3kip6qmk.cloudfront.net/marketing/press/images/template-gallery/newsletter-polaroid-0@2x.jpeg' alt='ad' /> */}
          </div>
          <div className='box5'>
              <FlightsList 
                results={results}
              />
              { spinnerOn && !results &&
                <div className="spinner">
                    <CircularProgress size={60} thickness={6} />
                </div>
              }
          </div>
          <div className='box6'>
              {/* <img src='https://d2slcw3kip6qmk.cloudfront.net/marketing/press/images/template-gallery/print-banners-gold-sale-advertisting-01-c.jpg' alt='ad' /> */}
          </div>
          <div className='box7'>
              <Footer />
          </div>
      </main>
    </div>
  );
}

export default App;
