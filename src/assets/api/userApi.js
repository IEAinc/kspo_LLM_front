import {API_ENDPOINT, http} from "./commons.js";

export const userApi = {
    login: (payload) => http.post(API_ENDPOINT.LOGIN, payload),
    logout: () => http.post(API_ENDPOINT.LOGOUT),
    validateToken: () => http.post(API_ENDPOINT.VALIDATE_TOKEN),
};