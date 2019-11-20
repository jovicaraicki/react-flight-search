import { createContext } from 'react';

const Context = createContext({
    results: null,
    spinnerOn: false,
    query: {
        flyFrom: '',
        to: '',
        dateFrom: (new Date()).toLocaleDateString(),
        dateTo: (new Date()).toLocaleDateString(),
        limit: 30,
        partner: 'picky',
        flyFromName: '',
        toName: ''
    },
    datePickerTime: new Date(),
    suggestions: [],      
    suggestionInputActive: false,
    currentlyFocusedInput: null,
    airlines: null,
    spinerOn: false
});

export default Context;