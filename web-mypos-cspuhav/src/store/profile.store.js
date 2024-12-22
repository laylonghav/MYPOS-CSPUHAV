import { json } from "react-router-dom";

export const setAccessToken = (value) => {
  localStorage.setItem("Access_Token", value);
};

export const getAccessToken = () => {
  return localStorage.getItem("Access_Token");
};


export const setProfile = (value) => {
  localStorage.setItem("Profile", value);
};

export const getProfile = () => {
  try {
    // Corrected from json.parse to JSON.parse
    var profile = localStorage.getItem("Profile");
    if (profile !== "" && profile !== null && profile !== undefined) {
      return JSON.parse(profile);
    }
    return null;
  } catch (error) {
    console.error("Error parsing profile:", error);
    return null;
  }
};


export const setPermission = (array) => {
  localStorage.setItem("permission", array);
};

export const getPermission = () => {
  try {
    // Corrected from json.parse to JSON.parse
    var permission = localStorage.getItem("permission");
    if (permission !== "" && permission !== null && permission !== undefined) {
      return JSON.parse(permission);
    }
    return null;
  } catch (error) {
    console.error("Error parsing permission:", error);
    return null;
  }
};
