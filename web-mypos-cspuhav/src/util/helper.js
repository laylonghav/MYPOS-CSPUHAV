import axios from "axios"
import { config } from "./config";


export const request =(url="",method="get",data={})=>{
    return axios({
      url: config.base_url + url,
      method: method,
      data: data,
      header:{},
    })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.log("Error");
        console.log(error);
      })
      .finally(() => {
        console.log("Block finaly called");
      });
}