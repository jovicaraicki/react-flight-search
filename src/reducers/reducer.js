const reducer = (state, action) => {
    switch (action.type) {
        case 'GET_RESULTS':
            return {
                ...state,
                results: action.payload
            }
        case 'CHANGE_QUERY':
            return {
                ...state,
                query: action.payload
            }
        case 'SUGGESTIONS':
            return {
                ...state,
                suggestions: action.payload
            }
        case 'SUGGESTION_INPUT':
            return {
                ...state,
                suggestionInputActive: action.payload
            }
        case 'FOCUSED_INPUT':
            return {
                ...state,
                currentlyFocusedInput: action.payload
            }
        case 'CHANGE_DATE':
            return {
                ...state,
                datePickerTime: action.payload
            }
        case 'CHANGE_CODE':
            return {
                ...state,
                flyFromCode: action.payload
            }
        case 'GET_AIRLINES':
            return {
                ...state,
                airlines: action.payload
            }
        case 'SET_SPINNER':
            return {
                ...state,
                spinnerOn: action.payload
            }
        default:
            return state;
    }
}

export default reducer;