import { ADD_CATEGORY, FETCH_CATEGORIES } from './types';

import { db } from '../firebase';

export const addCategory = data => (dispatch) => {
    dispatch({
        type: ADD_CATEGORY,
        payload: data,
    });
};

export const fetchCategory = uid => (dispatch) => {
    db.collection('users').doc(uid).collection('categories').get()
        .then((results) => {
            let categoryList = {};

            results.docs.forEach((doc) => {
                categoryList = {
                    ...categoryList,
                    [doc.id]: '',
                };
            });

            dispatch({
                type: FETCH_CATEGORIES,
                payload: categoryList,
            });
        });
};
