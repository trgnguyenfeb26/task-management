import axios from 'axios';
import backendUrl from '../backendUrl';

interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface LoginPayload {
  username: string;
  password: string;
}

type Token = string | null;

let token: Token = null;

const setToken = (newToken: string) => {
  token = newToken;
};

export const setConfig = () => {
  return {
    headers: { 'x-auth-token': token },
  };
};

const login = async (credentials: LoginPayload) => {
  const response = await axios.post(`${backendUrl}/login`, credentials);
  return response.data;
};

const signup = async (credentials: RegisterPayload) => {
  console.log('credentials', credentials);
  const response = await axios.post(`${backendUrl}/signup`, credentials);
  return response.data;
};

const authService = { login, signup, setToken };

export default authService;
