import React, { useEffect, useState } from "react";
import { request } from "../../util/helper";
import HomeGrid from "../../component/Home/HomeGrid";
import { configStore } from "../../store/configStore";
import { Button } from "antd";

export default function HomePage() {
  const { count, increase, decrease, config, setconfig } = configStore();
  const [home, setHome] = useState([]);

  useEffect(() => {
    getlist();
  }, []);

  const getlist = async () => {
    try {
      const res = await request("home", "get");
      console.log(res); // Debugging purposes
      if (res && res.list) {
        setHome(res.list);
      } else {
        console.error("Home data is missing or invalid.");
      }
    } catch (error) {
      console.error("Failed to fetch home data:", error);
    }
  };

  // const getconfigapi = async () => {
  //   try {
  //     const res = await request("config", "get");
  //     console.log(res); // Debugging purposes
  //     if (res) {
  //       setconfig(res);
  //     } else {
  //       console.error("Config data is missing or invalid.");
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch config data:", error);
  //   }
  // };

  return (
    <div>
      <h1>{config.supplier ? config.supplier.length : "No data"}</h1>
      <div>
        {config.supplier && config.supplier.length > 0 ? ( // Check if supplier exists and is not empty
          config.supplier.map((item, index) => (
            <div key={index}>
              {" "}
              {/* Added key prop for unique identification */}
              <h1>{item.name}</h1>
            </div>
          ))
        ) : (
          <h1>No suppliers available</h1> // Fallback message if no suppliers
        )}
      </div>

      <h1>{count}</h1>
      {/* <Button onClick={getconfigapi}>Get config from API</Button> */}
      <Button onClick={() => increase()}>+</Button>
      <Button onClick={() => decrease()}>-</Button>
      {home.length > 0 ? <HomeGrid data={home} /> : <p>No data to display</p>}
    </div>
  );
}
