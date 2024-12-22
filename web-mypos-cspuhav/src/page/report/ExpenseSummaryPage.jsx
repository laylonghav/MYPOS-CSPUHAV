
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { Table, DatePicker, Space, Select, Button } from "antd";
import dayjs from "dayjs";
import { request } from "../../util/helper";
import { configStore } from "../../store/configStore";

export default function SaleSummaryPage() {
  const { config } = configStore();
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState({
    from_date: dayjs().subtract(6, "d").format("YYYY-MM-DD"),
    to_date: dayjs().format("YYYY-MM-DD"),
    expense_type_id: null,
  });

  useEffect(() => {
    getList();
  }, [filter]);

  const getList = async () => {
    try {
      const res = await request("report_expense_summary", "get", filter);
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
    curveType: "function",
    legend: { position: "bottom" },
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Expense type name",
      dataIndex: "expense_type_name",
      key: "expense_type_name",
      render: (text) => (
        <div>
          {text.split(", ").map((name, index) => (
            <div key={index}>{name}</div> // Render each name in a new line
          ))}
        </div>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (value) =>
        parseFloat(value).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
    },
  ];

  const handleReset = () => {
    setFilter({
      from_date: dayjs().subtract(6, "d").format("YYYY-MM-DD"),
      to_date: dayjs().format("YYYY-MM-DD"),
      expense_type_id: null,
    });
  };

  return (
    <div>
      <div className="border-2 border-blue-700 p-4">
        <div className="bg-slate-700 p-4 text-white text-2xl">
          <Space>
            <div>Expense Summary</div>
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
            <Select
              style={{ width: 200 }}
              placeholder="Expense type"
              allowClear
              options={config?.expense_type}
              onChange={(id) =>
                setFilter((prev) => ({
                  ...prev,
                  expense_type_id: id,
                }))
              }
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
              chartType="LineChart"
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
