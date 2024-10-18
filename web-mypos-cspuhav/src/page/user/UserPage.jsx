import React, { useEffect, useState } from "react";
import { request } from "../../util/helper";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
export default function UserPage() {
  const [state, setState] = useState({
    list: [],
    role: [],
    loading: false,
    visible: false,
  });

  const [form] = Form.useForm();

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const res = await request("auth/get-list", "get");
    // alert(JSON.stringify(res))
    if (res && !res.error) {
      // setState({
      //   ...state,
      //   list: res.data,
      //   role: res.data_role,
      // });

      setState((pre) => ({
        ...pre,
        list: res.data,
        role: res.data_role,
      }));
    }
  };

  const onClickDelete = () => {};
  const onClickEdite = (item) => {
    form.setFieldsValue({
      // ...item,
      name: item.name,
      username: item.username,
      password: item.password,
      role_id: item.role_name,
      is_active: item.is_active,
    });
    onClickAddbtn();
  };
  const onClickAddbtn = () => {
    setState((pre) => ({
      ...pre,
      visible: true,
    }));
  };
  const onFinish = async (item) => {
    const data = {
      ...item,
      id: form.getFieldValue("id"),
      // name: item.name,
      // username: item.code,
      // password: item.password,
      // role_id: item.role_id,
      // is_active: item.status,
    };

    var method = "post";
    if (form.getFieldValue("id")) {
      //Cause Update
      method = "put";
    }
    try {
      const res = await request("auth/regester", method, data);
      if (res && !res.error) {
        message.success(res.message);
        getList();
        closeModul();
      } else {
        message.warning(res.error);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
    console.log(item);
  };
  const closeModul = () => {
    setState((pre) => ({
      ...pre,
      visible: false,
    }));
    form.resetFields();
  };

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
            key: "create_by",
            title: "Create by",
            dataIndex: "create_by",
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

      <Modal
        title={form.getFieldValue("id") ? "Edit user" : "New user"}
        open={state.visible}
        onCancel={closeModul}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input name",
              },
            ]}
            name="name"
            label="Name"
          >
            <Input placeholder="Name"></Input>
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input username",
              },
            ]}
            name="username"
            label="Username"
          >
            <Input placeholder="Username"></Input>
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input password",
              },
            ]}
            name="password"
            label="Password"
          >
            <Input.Password placeholder="Password"></Input.Password>
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please select role",
              },
            ]}
            name={"role_id"}
            label="Role"
          >
            <Select placeholder="Select role" options={state.role} />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please select status",
              },
            ]}
            name={"is_active"}
            label="Status"
          >
            <Select
              placeholder="Select Status"
              options={[
                {
                  label: "Active",
                  value: 1,
                },
                {
                  label: "Inactive",
                  value: 0,
                },
              ]}
            />
          </Form.Item>
          <Space>
            <Button onClick={closeModul}>Cacel</Button>
            <Button htmlType="submit" type="primary">
              {form.getFieldValue("id") ? "Update" : "Save"}
            </Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}
