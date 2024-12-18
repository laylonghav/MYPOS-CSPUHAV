import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { Table, DatePicker, Space, Button, Input, Image } from "antd";
import dayjs from "dayjs";
import { request } from "../../util/helper";
import { configStore } from "../../store/configStore";
import { configs } from "../../util/config";

export default function TopSaleSummaryPage() {
  const { config } = configStore();
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState({
    from_date: dayjs().subtract(6, "d").format("YYYY-MM-DD"),
    to_date: dayjs().format("YYYY-MM-DD"),
  });

  useEffect(() => {
    getList();
  }, [filter]);

  const getList = async () => {
    try {
      const res = await request("report_sale_top_item", "get", filter);
      if (res && !res.error) {
        setList(res.list);
        console.log(res.list);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const chartData = [
    ["Product", "Total Sales Amount"],
    ...list.map((item) => [
      item.product_name,
      parseFloat(item.total_sales_amount),
    ]),
  ];

  const chartOptions = {
    curveType: "function",
    legend: { position: "bottom" },
    hAxis: { title: "Product" },
    vAxis: { title: "Sales Amount" },
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Product Image",
      dataIndex: "product_image",
      key: "product_image",
      render: (text) => (
        <Image
          src={configs.image_Path + text}
          alt="Product"
          style={{ width: 50 }}
        />
      ),
    },
    {
      title: "Total Sales Amount",
      dataIndex: "total_sales_amount",
      key: "total_sales_amount",
      render: (text) => `$${parseFloat(text).toFixed(2)}`,
    },
  ];

  const handleReset = () => {
    setFilter({
      from_date: dayjs().subtract(6, "d").format("YYYY-MM-DD"),
      to_date: dayjs().format("YYYY-MM-DD"),
    });
  };

  return (
    <div>
      <div className="border-2 border-blue-700 p-4">
        <div className="bg-slate-700 p-4 text-white text-2xl">
          <Space>
            <div>Top Sales Summary</div>
            <DatePicker.RangePicker
              allowClear={false}
              defaultValue={[
                dayjs(filter.from_date, "YYYY-MM-DD"),
                dayjs(filter.to_date, "YYYY-MM-DD"),
              ]}
              onChange={(value) => {
                setFilter((prev) => ({
                  ...prev,
                  from_date: value[0].format("YYYY-MM-DD"),
                  to_date: value[1].format("YYYY-MM-DD"),
                }));
              }}
            />
            <Button
              onClick={handleReset}
              type="default"
              style={{ marginLeft: 10 }}
            >
              Reset
            </Button>
          </Space>
        </div>

        <div className="my-4">
          {list.length > 0 ? (
            <Chart
              className="h-[500px]"
              chartType="LineChart"
              width="100%"
              data={chartData}
              options={chartOptions}
              legendToggle
            />
          ) : (
            <p>No data available for the selected date range.</p>
          )}
        </div>
      </div>

      <div className="border-2 border-blue-700 p-4 my-4">
        <Table
          columns={columns}
          dataSource={list}
          rowKey={(record) => record.product_id}
          bordered
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: "No data available" }}
        />
      </div>
    </div>
  );
}
