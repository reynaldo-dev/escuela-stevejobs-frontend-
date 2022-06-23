import { types } from "../types";



export const docentesReducer = (state = [], action) => {

    switch (action.type) {

        case types.DOCENTES_GET_ALL:
            return {
                ...state,
                docentes: action.payload.docentes
            }
        case types.DOCENTES_GET_FILTER:
            return {
                ...state,
                docentes: action.payload.docentes
            }

        default:
            return state;
    }
}