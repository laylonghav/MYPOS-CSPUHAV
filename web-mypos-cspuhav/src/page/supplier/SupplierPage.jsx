import React, { useEffect, useState } from "react";
import { request } from "../../util/helper";
import { Space, Table, Tag, Button, Modal, Input, Form, message } from "antd";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import dayjs from "dayjs";

export default function SupplierPage() {
  const [formrefe] = Form.useForm();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    visibleModule: false,
    id: null,
    Name: "",
    Description: "",
    Status: "",
    Parent_id: null,
  });


  useEffect(() => {
    getlist();
  }, []); 
  

  const [filter, setFilter] = useState({
    txtsearch: "",
  });

  const getlist = async () => {
    try {
      const param = {
        txtsearch: filter.txtsearch,
      };
      setLoading(true);
      const res = await request("supplier", "get", param);
      setLoading(false);
      setList(res.list);
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
      setLoading(false);
    }
  };

  const onClickEdite = (item) => {
    setState({
      ...state,
      ...item,
      visibleModule: true,
    });
    formrefe.setFieldsValue({
      ...item,
    });
  };

  const onClickDelete = async (data, index) => {
    Modal.confirm({
      title: "Remove",
      content: "Are you sure to remove?",
      onOk: async () => {
        try {
          const res = await request("supplier", "Delete", { id: data.id });
          if (res && !res.error) {
            const newlist = list.filter((item) => item.id !== data.id);
            setList(newlist);
            message.success(res.message);
          }
        } catch (error) {
          console.error("Failed to delete supplier:", error);
          message.error("Failed to delete supplier.");
        }
      },
    });
  };

  const onClickAddbtn = () => {
    setState({
      ...state,
      visibleModule: true,
    });
  };

  const oncloseModule = () => {
    formrefe.resetFields();
    setState({
      ...state,
      visibleModule: false,
      id: null,
    });
  };

  const onFinish = async (item) => {
    const data = {
      ...item,
      id: formrefe.getFieldValue("id"),
    };
    const method = data.id ? "put" : "post";

    try {
      const res = await request("supplier", method, data);
      if (res && !res.error) {
        message.success(res.message);
        getlist();
        oncloseModule();
      }
    } catch (error) {
      console.error("Failed to save supplier:", error);
      message.error("Failed to save supplier.");
    }
  };

  return (
    <MainPage loading={loading}>
      {/* <h1>{statesearch.txtsearch}</h1> */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>Supplier</div>
          <Input.Search
            onChange={(value) =>
              setFilter((p) => ({
                ...p,
                txtsearch: value.target.value,
              }))
            }
            onSearch={getlist}
            allowClear
            style={{ marginLeft: 10 }}
            placeholder="Search"
          />
        </div>
        <Button type="primary" icon={<MdAdd />} onClick={onClickAddbtn}>
          New
        </Button>
      </div>

      <Modal
        open={state.visibleModule}
        title={formrefe.getFieldValue("id") ? "Edit supplier" : "New supplier"}
        footer={null}
        onCancel={oncloseModule}
      >
        <Form layout="vertical" onFinish={onFinish} form={formrefe}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="Name" allowClear />
          </Form.Item>
          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: "Code is required" }]}
          >
            <Input placeholder="Code" />
          </Form.Item>
          <Form.Item
            name="tel"
            label="Tel"
            rules={[{ required: true, message: "Telephone is required" }]}
          >
            <Input placeholder="Tel" />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input.TextArea placeholder="Address" />
          </Form.Item>
          <Form.Item name="website" label="Website">
            <Input placeholder="Website" />
          </Form.Item>
          <Form.Item name="note" label="Note">
            <Input.TextArea placeholder="Note" />
          </Form.Item>
          <Space>
            <Button onClick={oncloseModule}>Cancel</Button>
            <Button htmlType="submit" type="primary">
              {formrefe.getFieldValue("id") ? "Update" : "Save"}
            </Button>
          </Space>
        </Form>
      </Modal>

      <Table
        dataSource={list}
        columns={[
          { title: "No", key: "No", render: (item, data, index) => index + 1 },
          { title: "Name", dataIndex: "name", key: "name" },
          { title: "Code", dataIndex: "code", key: "code" },
          { title: "Tel", dataIndex: "tel", key: "tel" },
          { title: "Email", dataIndex: "email", key: "email" },
          { title: "Address", dataIndex: "address", key: "address" },
          { title: "Website", dataIndex: "website", key: "website" },
          { title: "Note", dataIndex: "note", key: "note" },
          { title: "Create By", dataIndex: "create_by", key: "create_by" },
          {
            title: "Create at",
            dataIndex: "create_at",
            key: "create_at",
            render: (value) => dayjs(value).format("DD-MM-YYYY"),
          },
          {
            title: "Action",
            key: "Action",
            align: "center",
            render: (item, data, index) => (
              <Space>
                <Button
                  type="primary"
                  icon={<MdEdit />}
                  onClick={() => onClickEdite(data, index)}
                />
                <Button
                  type="primary"
                  danger
                  icon={<MdDelete />}
                  onClick={() => onClickDelete(data, index)}
                />
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
}
