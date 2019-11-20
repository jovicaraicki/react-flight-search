import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import '../styles/_search-flights.scss';
import Context from '../context/Context';

import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';

import moment from 'moment';

function closestByClass(el, clazz) {
    while (el.className !== clazz) {
        el = el.parentNode;
        if (!el) {
            return null;
        }
    }
    return el;
}

function useWindowSize() {
    const isClient = typeof window === 'object';
  
    function getSize() {
      return {
        width: isClient ? window.innerWidth : undefined,
        height: isClient ? window.innerHeight : undefined
      };
    }
  
    const [windowSize, setWindowSize] = useState(getSize);
  
    useEffect(() => {
      if (!isClient) {
        return false;
      }
      
      function handleResize() {
        setWindowSize(getSize());
      }
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return windowSize;
  }

const SearchFlights = (props) => {
    const [code, setCode] = useState([]);

    const { state, dispatch, spinnerOn } = useContext(Context);

    const { query, suggestions, suggestionInputActive, currentlyFocusedInput, datePickerTime } = state;

    const size = useWindowSize();

    useEffect(() => {
        if (currentlyFocusedInput) {
            if (suggestionInputActive) {
                currentlyFocusedInput.focus();
            } else {
                currentlyFocusedInput.blur();
                dispatch({ type: 'FOCUSED_INPUT', payload: null });
            }
        }
    });

    const handleFocus = (event) => {
        const inputName = event.target.getAttribute('name');

        dispatch({ type: 'SUGGESTION_INPUT', payload: true });
        dispatch({ type: 'FOCUSED_INPUT', payload: event.target });
        /* Instead of relying on blur event, listeners on click and keydown
         * are attached in order to control focusing out of the input fields
         */
        window.addEventListener('click', clickHandler)
        window.addEventListener('keydown', keypressHandler)
        
        function clickHandler(event) {
            /* if clicked outside the currently active input or suggestions */
            if (!closestByClass(event.target, 'suggestions') || !closestByClass(event.target, inputName)) {
                /* if clicked into the other input, 
                 * re-run this method to update currently active input to that one,
                 * otherwise allow focus out
                 */
                if (event.target.getAttribute('name') === 'to' || event.target.getAttribute('name') === 'flyFrom') {
                    handleFocus(event);
                    dispatch({ type: 'SUGGESTIONS', payload: [] });
                } else {
                    dispatch({ type: 'SUGGESTION_INPUT', payload: false });
                    dispatch({ type: 'SUGGESTIONS', payload: [] });
                }
           
                window.removeEventListener('keydown', keypressHandler)
                window.removeEventListener('click', clickHandler);
            }
        }
        function keypressHandler(event) {
            if ((event.shiftKey && event.key === 'Tab') || event.key === 'Tab') {

                dispatch({ type: 'SUGGESTION_INPUT', payload: false });
                dispatch({ type: 'SUGGESTIONS', payload: [] });
                window.removeEventListener('keydown', keypressHandler)
                window.removeEventListener('click', clickHandler);
            }
        }
    }

    const handleSubmit = e => {
        dispatch({ type: 'SET_SPINNER', payload: true });
        props.updateResults(null);
        e.preventDefault();
        axios.get('https://api.skypicker.com/flights', {
            params: {
                // ...query
                flyFrom: query.flyFrom,
                to: query.to,
                dateFrom: moment(query.dateFrom).format('DD/MM/YYYY'),
                dateTo: moment(query.dateTo).format('DD/MM/YYYY'),
                partner: query.partner
            }
        })
        .then(res => {
            const results = res.data.data;
            dispatch({ type: 'SET_SPINNER', payload: false });
            props.updateResults(results);
        })
        .catch(err => {
            console.log(err.message)
            dispatch({ type: 'SET_SPINNER', payload: false });
        })

    }

    const handleInputChange = (event, date) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const queryChange = query;
        queryChange[name] = value;
        queryChange[`${name}Name`] = value;
        
        dispatch({ type: 'CHANGE_QUERY', payload: queryChange });

        fetchSuggestions(target.value);
    }

    const handleDateChange = (event, date) => {
        const queryChange = query;
        queryChange.dateFrom = date.toLocaleDateString();
        queryChange.dateTo = date.toLocaleDateString();

        dispatch({ type: 'CHANGE_QUERY', payload: queryChange });
        dispatch({ type: 'CHANGE_DATE', payload: date});
    }

    const fetchSuggestions = (value) => {
        axios.get(`https://api.skypicker.com/locations/`, {
            params: {
                term: value,
                locale: 'en-US',
                limit: 7
            }
        })
            .then(res => {     
                setCode(res.data.locations);   
                const suggestions = res.data.locations.map(location => location.name);
                dispatch({ type: 'SUGGESTIONS', payload: suggestions });
            })
    }

    const handleSuggestionItemClick = (event) => {
        const queryChange = query;
        queryChange[`${currentlyFocusedInput.getAttribute('name')}Name`] = event.target.innerText;

        const filterCode = code.filter(loc => loc.name === event.target.innerText);

        queryChange[currentlyFocusedInput.getAttribute('name')] = filterCode[0].code;

        dispatch({ type: 'CHANGE_QUERY', payload: queryChange });
        dispatch({ type: 'SUGGESTIONS', payload: suggestions });
    }

    return (
            <Card>
                <CardText>
                    <form
                        className="searchForm"
                        onSubmit={handleSubmit}>
                        <div>
                            <TextField
                                className="flyFrom"
                                name="flyFrom"
                                autoComplete="off"
                                floatingLabelText="Fly from"
                                value={query.flyFromName}
                                onFocus={suggestionInputActive ? null : handleFocus}
                                onChange={handleInputChange}
                            />
                            <TextField
                                className="to"
                                name="to"
                                autoComplete="off"
                                floatingLabelText="Fly to"
                                value={query.toName}
                                onFocus={suggestionInputActive ? null : handleFocus}
                                onChange={handleInputChange}
                            />
                            <DatePicker
                                value={datePickerTime}
                                className="datePicker"
                                DateTimeFormat={global.Intl.DateTimeFormat}
                                locale="en-GB"
                                hintText="Portrait Dialog"
                                autoOk={true}
                                onChange={handleDateChange} 
                            />
                            <RaisedButton
                                className="submitButton"
                                label="Search"
                                primary={true}
                                type="submit"
                            />
                            {suggestions.length > 0 ?
                                <Paper
                                    className="suggestions"
                                    style={{
                                        left: (() => {
                                            if (currentlyFocusedInput && currentlyFocusedInput.getAttribute('name') === 'to' && size.width > 991) {
                                                return '277px'
                                            }
                                        })(),
                                        top: (() => {
                                            if (currentlyFocusedInput && currentlyFocusedInput.getAttribute('name') === 'to' && size.width <= 991) {
                                                return '144px'
                                            } 
                                            if (currentlyFocusedInput && currentlyFocusedInput.getAttribute('name') === 'flyFrom' && size.width <= 991) {
                                                return '71px'
                                            }
                                        })()
                                    }}>
                                    <Menu desktop={true}>
                                        {suggestions.map((suggestion, index) => {
                                            return (
                                                <MenuItem
                                                    primaryText={suggestion}
                                                    key={index}
                                                    onClick={handleSuggestionItemClick} />
                                            )
                                        })}
                                    </Menu>
                                </Paper> : null
                            }
                        </div>
                    </form>
                </CardText>
            </Card>
    );
};

export default SearchFlights;