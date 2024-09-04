import React, { useEffect, useState } from "react";
import { request } from "../../util/helper";
import HomeGrid from "../../component/Home/HomeGrid";

export default function HomePage() {
  const [home, setHome] = useState([]);

  useEffect(() => {
    getlist();
  }, []);

  const getlist = async () => {
    try {
      const res = await request("home", "get");
      console.log(res); // Debugging purposes
      if (res) {
        setHome(res.list);
      }
    } catch (error) {
      console.error("Failed to fetch home data:", error);
    }
  };

  return (
    <div>
          <HomeGrid data={home} />
    </div>
  );
}
