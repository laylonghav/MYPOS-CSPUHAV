import axios from "axios";
import { config } from "./config";
import { setServerStatus } from "../store/server.store";
import { getAccessToken } from "../store/profile.store";

export const request = (url = "", method = "get", data = {}) => {
  var access_token = getAccessToken();
  // access_token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InByb2ZpbGUiOnsiaWQiOjEsInJvbGVfaWQiOjEsIm5hbWUiOiJMYXlsb25naGF2QEdtYWlsLmNvbSIsInVzZXJuYW1lIjoibGF5bG9uZ2hhdiIsImlzX2FjdGl2ZSI6MSwiY3JlYXRlX2J5IjoiSGF2IiwiY3JlYXRlX2F0IjoiMjAyNC0wOS0wNFQyMDo1OToxMS4wMDBaIn0sInBlcm1pc2lvbiI6WyJ2aWV3X2FsbCIsImRlbGV0ZSIsImVkaXQiXX0sImlhdCI6MTcyNTk0NjIwMywiZXhwIjoxNzI1OTQ2MzgzfQ.65O6NQQ-q2T-NL_OcHv-9yL01oBvQ5O-D-OVDOSdkQs";
  //-in react
  var headers = { "Content-Type": "application/json" };
  if (data instanceof FormData) {
    // check if param data is FormData
    headers = { "Content-Type": "multipart/form-data" };
  }
  return axios({
    url: config.base_url + url,
    method: method,
    data: data,
    headers: {
      ...headers,
      authorization: "Bearer " + access_token,
    }, // Headers are properly declared
  })
    .then((res) => {
      setServerStatus(200); // Server is OK
      return res.data;
    })
    .catch((error) => {
      // Handle HTTP error
      // alert(error.code);
      if (error.response) {
        let status = error.response.status;
        if (status === 401) {
          status = 403; // Convert 401 to 403 as per your requirement
        }
        // alert(`HTTP Error Status: ${status}`); // Alert status
        setServerStatus(status); // Set status in store
        console.log("Error status:", status);
        console.log("Error details:", error.response.data); // More specific error details
        console.log("Error details:", error); // More specific error details
      } else if (error.code === "ERR_NETWORK") {
        alert("Network error occurred.");
        setServerStatus("error"); // Mark the server as having a network error
      } else if (error.request) {
        // Request was made but no response received
        console.log("No response received:", error.request);
        console.log("No response received:", error);
      } else {
        // Something happened in setting up the request
        console.log("Request setup error:", error.message);
      }
    })
    .finally(() => {
      console.log("Request process finalized.");
    });
};
