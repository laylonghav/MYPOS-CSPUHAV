import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { Table, DatePicker, Space, Button, Input } from "antd";
import dayjs from "dayjs";
import { request } from "../../util/helper";
import { configStore } from "../../store/configStore";

export default function CustomerSummaryPage() {
  const { config } = configStore();
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState({
    from_date: dayjs().subtract(6, "d").format("YYYY-MM-DD"),
    to_date: dayjs().format("YYYY-MM-DD"),
    name: null,
  });

  useEffect(() => {
    getList();
  }, [filter]);

  const getList = async () => {
    try {
      const res = await request("report_new__customer_summary", "get", filter);
      if (res && !res.error) {
        setList(res.list);
        console.log(res.list);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const chartData = [
    ["Date", "Total Amount"],
    ...list.map((item) => [item.title, parseFloat(item.total_amount)]),
  ];

  const chartOptions = {
    title: "New Customer Summary",
    chartArea: { width: "50%" },
    hAxis: { title: "Total Amount", minValue: 0 },
    vAxis: { title: "Date" },
    legend: { position: "none" },
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <div>
          {text.split(", ").map((name, index) => (
            <div key={index}>{name}</div>
          ))}
        </div>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
    },
  ];

  const handleReset = () => {
    setFilter({
      from_date: dayjs().subtract(6, "d").format("YYYY-MM-DD"),
      to_date: dayjs().format("YYYY-MM-DD"),
      name: null,
    });
  };

  return (
    <div>
      <div className="border-2 border-blue-700 p-4">
        <div className="bg-slate-700 p-4 text-white text-2xl">
          <Space>
            <div>New Customer Summary</div>
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
            <Input.Search
              onSearch={getList}
              allowClear
              onChange={(event) =>
                setFilter((p) => ({
                  ...p,
                  name: event.target.value,
                }))
              }
              placeholder="Search"
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
          {list.length > 0 && (
            <Chart
              className="h-[500px]"
              chartType="BarChart"
              width="100%"
              data={chartData}
              options={chartOptions}
              legendToggle
            />
          )}
        </div>
      </div>

      <div className="border-2 border-blue-700 p-4 my-4">
        <Table
          columns={columns}
          dataSource={list}
          rowKey={(record) => `${record.title}-${record.total_qty}`}
          bordered
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
}
