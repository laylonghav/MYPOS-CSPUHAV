import axios from "axios";
import { config } from "./config";
import { setServerStatus } from "../store/server.store";

export const request = (url = "", method = "get", data = {}) => {
  return axios({
    url: config.base_url + url,
    method: method,
    data: data,
    headers: {}, // Headers are properly declared
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
