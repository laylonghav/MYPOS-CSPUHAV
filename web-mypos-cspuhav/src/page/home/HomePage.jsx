import React, { useEffect, useState } from "react";
import { request } from "../../util/helper";
import HomeGrid from "../../component/Home/HomeGrid";
import { configStore } from "../../store/configStore";
import { Button } from "antd";
import SaleChart from "../../component/Home/SaleChart";
import ExpenseChart from "../../component/Home/ExpenseChart";

export default function HomePage() {
  const { count, increase, decrease, config, setconfig } = configStore();
  const [home, setHome] = useState([]);
  const [saleByMonths, setSaleByMonths] = useState([]);
  const [expenseByMonths, setExpenseByMonths] = useState([]);

  useEffect(() => {
    getlist();
  }, []);

  const getlist = async () => {
    try {
      const res = await request("dashboard", "get");
      console.log(res);
      // alert(JSON.stringify(res.customer)); // Debugging purposes
      if (res && res.customer) {
        setHome(res.dashboard);
        if (res.sale_summary_by_months) {
          let datatmp = [["Months", "Sales"]];
          res.sale_summary_by_months.forEach((item) => {
            datatmp.push([item.title + " ", Number(item.total)]);
          });
          setSaleByMonths(datatmp);
          console.log(datatmp);
        }
        if (res.expense_summary_by_months) {
          let datatmp = [["Months", "Sales"]];
          res.expense_summary_by_months.forEach((item) => {
            datatmp.push([item.title + " ", Number(item.total)]);
          });
           setExpenseByMonths(datatmp);
          console.log(datatmp);
        }
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
      {home.length > 0 ? <HomeGrid data={home} /> : <p>No data to display</p>}{" "}
      <div className="mt-[50px]">
        
        <SaleChart data={saleByMonths} />
        <ExpenseChart data={expenseByMonths} />

      
      </div>
    </div>
  );
}

{
  /* <h1>{config.supplier ? config.supplier.length : "No data"}</h1> */
}
{
  /* <div>
        {config.supplier && config.supplier.length > 0 ? ( // Check if supplier exists and is not empty
          config.supplier.map((item, index) => (
            <div key={index}>
          
              <h1>{item.name}</h1>
            </div>
          ))
        ) : (
          <h1>No suppliers available</h1> // Fallback message if no suppliers
        )}
      </div> */
}

{
  /* <h1>{count}</h1>
   <Button onClick={getconfigapi}>Get config from API</Button> 
      <Button onClick={() => increase()}>+</Button>
      <Button onClick={() => decrease()}>-</Button>
      {home.length > 0 ? <HomeGrid data={home} /> : <p>No data to display</p>} */
}
