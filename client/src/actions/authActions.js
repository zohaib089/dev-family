import axios from 'axios';

import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
//Register User

export const registeruser = (userData, history) => dispatch => {
  axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Login-Get user token
export const loginUser = userData => dispatch => {
  axios
    .post('/api/users/login', userData)
    .then(res => {
      //Save to local Storage
      const { token } = res.data;
      //Set token to localstore
      localStorage.setItem('jwtToken', token);
      //Set token to Auth header
      setAuthToken(token);
      //Decode token to get user data
      const decoded = jwt_decode(token);
      //SEt current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//SEt logged in User
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};
//log user out
export const logoutUser = () => dispatch => {
  //remove token from local storage
  localStorage.removeItem('jwtToken');
  //remove auth header from futuer request
  setAuthToken(false);
  //set current user to empty object which will set isauthenticated to false
  dispatch(setCurrentUser({}));
};
