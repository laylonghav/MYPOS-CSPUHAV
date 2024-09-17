import React, { useEffect, useState } from "react";
import { request } from "../../util/helper";
import { Button, Input, Space, Table, Tag } from "antd";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
export default function UserPage() {
  const [state, setState] = useState({
    list: [],
    loading: false,
  });

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const res = await request("auth/get-list", "get");
    // alert(JSON.stringify(res))
    if (res && !res.error) {
      setState({
        ...state,
        list: res.data,
      });
    }
  };

  const onClickDelete = () => {};
  const onClickEdite = () => {};
  const onClickAddbtn = () => {};

  return (
    <div>
      <h1>UserPage</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: 10,
        }}
        className=""
      >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
            className=""
          >
            <div className="">User</div>
            <Input.Search
              style={{ marginLeft: 10 }}
              placeholder="Search"
            ></Input.Search>
          </div>
        <Button type="primary" icon={<MdAdd />} onClick={onClickAddbtn}>
          New
        </Button>
      </div>
      <Table
        dataSource={state.list}
        columns={[
          {
            key: "no",
            title: "No",
            render: (value, data, index) => index + 1,
          },
          {
            key: "name",
            title: "Name",
            dataIndex: "name",
          },
          {
            key: "username",
            title: "Username",
            dataIndex: "username",
          },
          {
            key: "role_name",
            title: "Role",
            dataIndex: "role_name",
          },
          {
            key: "is_active",
            title: "Status",
            dataIndex: "is_active",
            render: (item, data, index) =>
              item == 1 ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">Inactive</Tag>
              ),
          },
          {
            title: "Action",
            // dataIndex: "Action",
            align: "center",
            key: "Action",
            render: (item, data, index) => (
              <Space>
                <Button
                  type="primary"
                  icon={<MdEdit />}
                  onClick={() => onClickEdite(data, index)}
                ></Button>
                <Button
                  type="primary"
                  danger
                  icon={<MdDelete />}
                  onClick={() => onClickDelete(data, index)}
                ></Button>
              </Space>
            ),
          },
        ]}
      ></Table>
    </div>
  );
}
