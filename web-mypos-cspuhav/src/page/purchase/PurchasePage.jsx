import React, { useEffect, useState } from "react";
import moment from "moment";
import { formatDateClient, formatDateServer, request } from "../../util/helper";
import "./style.css";
import {
  Space,
  Table,
  Button,
  Modal,
  Input,
  Form,
  Select,
  message,
  DatePicker,
  InputNumber,
} from "antd";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import { configStore } from "../../store/configStore";

export default function PurchasePage() {
  const { config } = configStore();
  const [form] = Form.useForm();
  const [state, setState] = useState({
    loading: false,
    visibleModule: false,
    list: [],
  });

  const [filter, setFilter] = useState({
    txtsearch: "",
    supplier: "",
    status: "",
  });

  useEffect(() => {
    getlist();
  }, [filter]);

  const getlist = async () => {
    try {
      //  const param = {
      //    txtsearch: filter.txtsearch,
      //    supplier: filter.supplier,
      //    status: filter.status,
      //  };
      const res = await request("purchase", "get", filter);

      if (res && res.list && Array.isArray(res.list)) {
        setState((prev) => ({
          ...prev,
          list: res.list,
        }));
      } else if (res && res.message) {
        console.error("Server response:", res.message);
      }
    } catch (error) {
      console.error("Failed to fetch list:", error.message || error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
    }
  };

  const onClickEdit = async (data) => {
    const {
      id,
      supplier_id,
      ref,
      ship_company,
      ship_cost,
      paid_amount,
      paid_date,
      status,
    } = data;

    form.setFieldsValue({
      id,
      supplier_id,
      ref,
      ship_company,
      ship_cost,
      paid_amount,
      paid_date: paid_date ? moment(paid_date) : null,
      status,
    });

    setState((prevState) => ({
      ...prevState,
      visibleModule: true,
    }));
  };

  const onClickDelete = (data) => {
    Modal.confirm({
      title: "Remove data",
      content: "Are you sure you want to remove?",
      onOk: async () => {
        const res = await request("purchase", "delete", data);
        if (res && !res.error) {
          message.success(res.message);
          getlist();
        }
      },
    });
  };

  const onClickNew = async () => {
    const res = await request("newref", "post");
    if (res && !res.error) {
      form.setFieldsValue({ ref: res.ref });
      setState((prev) => ({
        ...prev,
        visibleModule: true,
      }));
    }
  };

  const oncloseModule = () => {
    setState((prev) => ({
      ...prev,
      visibleModule: false,
    }));
    getlist();
    form.resetFields();
  };

  const onFinish = async (item) => {
    const params = {
      ...item,
      id: form.getFieldValue("id"),
      paid_date: formatDateServer(item.paid_date),
    };

    try {
      const method = form.getFieldValue("id") ? "put" : "post";
      const res = await request("purchase", method, params);

      if (res && !res.error) {
        message.success(res.message);
        oncloseModule();
      } else {
        message.error(res.error?.ref || "An error occurred");
      }
    } catch (error) {
      console.error("Request failed", error);
    }
  };

  return (
    <MainPage loading={state.loading}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "10px",
        }}
      >
        <Space>
          <div>Purchase</div>
          <Input.Search
          onSearch={getlist}
            allowClear
            onChange={(event) =>
              setFilter((prev) => ({ ...prev, txtsearch: event.target.value }))
            }
            placeholder="Search"
          />
          <Select
            style={{ width: 200 }}
            placeholder="Supplier"
            allowClear
            options={config.supplier}
            onChange={(id) => setFilter((prev) => ({ ...prev, supplier: id }))}
          />
          <Select
            style={{ width: 200 }}
            placeholder="Purchase status"
            allowClear
            options={config.purchase_status}
            onChange={(id) => setFilter((prev) => ({ ...prev, status: id }))}
          />
          <Button onClick={getlist} type="primary">
            Filter
          </Button>
        </Space>
        <Button type="primary" icon={<MdAdd />} onClick={onClickNew}>
          New
        </Button>
      </div>

      <Modal
        open={state.visibleModule}
        title={form.getFieldValue("id") ? "Edit Purchase" : "New Purchase"}
        footer={null}
        onCancel={oncloseModule}
        width={600}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            name="supplier_id"
            label="Supplier"
            rules={[{ required: true, message: "Please select supplier" }]}
          >
            <Select placeholder="Supplier" options={config.supplier} />
          </Form.Item>
          <Form.Item
            name="ref"
            label="Reference number"
            rules={[{ required: true }]}
          >
            <Input disabled placeholder="Reference number" />
          </Form.Item>
          <Form.Item
            name="ship_company"
            label="Ship company"
            rules={[{ required: true }]}
          >
            <Input placeholder="Ship company" />
          </Form.Item>
          <Form.Item
            name="ship_cost"
            label="Ship cost"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} placeholder="Ship cost" />
          </Form.Item>
          <Form.Item
            name="paid_amount"
            label="Paid amount"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} placeholder="Paid amount" />
          </Form.Item>
          <Form.Item
            name="paid_date"
            label="Paid date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select placeholder="Status" options={config.purchase_status} />
          </Form.Item>
          <Space>
            <Button onClick={oncloseModule}>Cancel</Button>
            <Button htmlType="submit" type="primary">
              {form.getFieldValue("id") ? "Update" : "Save"}
            </Button>
          </Space>
        </Form>
      </Modal>

      <Table
        rowKey={(record) => record.id} // Ensure each row has a unique key
        dataSource={state.list}
        columns={[
          {
            title: "No",
            key: "No",
            render: (text, record, index) => index + 1,
          },
          {
            title: "Supplier",
            dataIndex: "supplier_name",
            key: "supplier_name",
          },
          { title: "Reference number", dataIndex: "ref", key: "ref" },
          {
            title: "Ship company",
            dataIndex: "ship_company",
            key: "ship_company",
          },
          { title: "Ship cost", dataIndex: "ship_cost", key: "ship_cost" },
          {
            title: "Paid amount",
            dataIndex: "paid_amount",
            key: "paid_amount",
          },
          { title: "Status", dataIndex: "status", key: "status" },
          {
            title: "Paid date",
            dataIndex: "paid_date",
            key: "paid_date",
            render:(value)=> formatDateClient(value),
          },
          { title: "Create by", dataIndex: "create_by", key: "create_by" },
          {
            title: "Action",
            key: "Action",
            render: (text, record, index) => (
              <Space>
                <Button
                  type="primary"
                  icon={<MdEdit />}
                  onClick={() => onClickEdit(record)}
                />
                <Button
                  type="primary"
                  danger
                  icon={<MdDelete />}
                  onClick={() => onClickDelete(record)}
                />
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
}
