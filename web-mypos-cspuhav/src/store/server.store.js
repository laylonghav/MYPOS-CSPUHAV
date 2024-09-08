
export const setServerStatus = (status) => {
  localStorage.setItem("Servers_status", status);
};

export const getServerStatus = () => {
  return localStorage.getItem("Servers_status");
};
