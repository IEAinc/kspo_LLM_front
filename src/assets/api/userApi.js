import {API_ENDPOINT, http} from "./commons.js";

export const userApi = {
    login: (payload) => {
        // 상태코드 200 의 Mock Promise 반환
        return new Promise((resolve) => {
            resolve({status: 200});

        });
    }/*http.post(API_ENDPOINT.LOGIN, payload)*/,
    logout: () => http.post(API_ENDPOINT.LOGOUT),
    validateToken: () => {
        return new Promise((resolve) => {
            resolve({status: 200 , data: {
                    id: "testuser",
                    name: "관리자"
                }});
        });
    }/*http.post(API_ENDPOINT.VALIDATE_TOKEN)*/,
};