import { logoutUser } from "@/utils/auth";
import axios from "axios";
// import { resetCompany } from "features/company/companySlice";
// import store from "../store"; // Adjust the import path as necessary
// import { logout } from "features/user/userSlice";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  responseInterceptor: (response) => {
    return response;
  },
  requestInterceptor: (request) => {
    // Add your authentication logic here, e.g., attaching the authentication token to the request headers
    return request;
  },
});

API.interceptors.response.use(
  (response) => {
    // console.log("interceptedResponse");
    // console.log(response.status);
    // console.log(response.statusText);

    return response;
  },
  (error) => {
    if (error.response) {
      if (error.name === "AxiosError" && error.response.status === 500) {
        // Handle 500 Internal Server Error
        return Promise.reject(
          new Error(error.response.data.message || "Internal Server Error"),
        );
      }
    }

    if (error.response) {
      console.log(error.response);

      if (error.response.status === 403) {
        return Promise.reject(
          new Error(
            "Required Admin Role! You do not have permission to perform this action.",
          ),
        );
      }

      if (
        error.response.status === 401 &&
        //  || error.response.status === 403
        error.response.data.message === "Token Expired!"

        // || error.response.data.message === "No token provided!"
      ) {
        // Logout the user and clear local storage
        logoutUser();

        // Optionally, redirect the user to the login page
        // window.location.href = "/app/client-login";
      }
    }

    return Promise.reject(error);
  },
);

// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.log(error);

//     if (
//       (error.response.status === 401 || error.response.status === 403) &&
//       (error.response.data.message === "Token Expired!" ||
//         error.response.data.message === "No token provided!")
//     ) {
//       // Dispatch resetCompany action
//       store.dispatch(resetCompany());
//       store.dispatch(logout());

//       // reset key user, userinfo, persist:root from localstorage
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       localStorage.removeItem("userinfo");
//       localStorage.removeItem("persist:root");

//       // Token expired, handle the error here
//       // alert("Token Expired! Please log in again.");

//       // Optionally, redirect the user to the login page
//       window.location.href = "/app/client-login";
//     }
//     return Promise.reject(error);
//   },
// );

export default API;
