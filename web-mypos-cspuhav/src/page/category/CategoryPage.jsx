import React, { useEffect, useState } from "react";
import { request } from "../../util/helper";
import {
  Space,
  Table,
  Tag,
  Button,
  Modal,
  Input,
  Form,
  Select,
  message,
} from "antd";
import { MdAdd, MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";

export default function CategoryPage() {
  const [formrefe] = Form.useForm();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    visblaModule: false,
    id: null,
    Name: "",
    Description: "",
    Status: "",
    Parent_id: null,
  });

  useEffect(() => {
    getlist();
  }, []);

  const getlist = async () => {
    try {
      setLoading(true);
      const res_config = await request("config", "get"); 
      console.log(res_config)
      const res = await request("category", "get"); // Await the asynchronous request
      setLoading(false);
      setList(res.list || []); // Safely set the list to an empty array if res.list is undefined
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const onClickEdite = (data, index) => {
    setState({
      ...state,
      visblaModule: true,
      id: data.id,
      name: data.name,
      description: data.description,
      status: data.status,
      parent_id: data.parent_id,
    });
    formrefe.setFieldsValue({
      id: data.id, //hiden id (save | update)
      name: data.name,
      description: data.description,
      status: data.status,
      parent_id: data.parent_id,
    });
    console.log(data);
  };
  const onClickDelete = async (data, index) => {
    Modal.confirm({
      title: "Remove",
      content: "Are you sure to remove ?",
      onOk: async () => {
        const res = await request("category", "Delete", {
          id: data.id,
        });

        if (res && !res.error) {
          const newlist = list.filter((item) => item.id != data.id);
          setList(newlist);
          message.success(res.message);
        }
      },
    });

    // alert(JSON.stringify(res));
    console.log(data);
  };

  const onClickAddbtn = () => {
    setState({
      ...state,
      visblaModule: true,
    });
  };

  const oncloseModule = () => {
    formrefe.resetFields();
    setState({
      ...state,
      visblaModule: false,
      id: null,
    });
  };

  // const onSave = async () => {
  //   var data = {
  //     id: state.id,
  //     Name: state.Name,
  //     Description: state.Description,
  //     Status: state.Status,
  //     Parent_id: state.Parent_id,
  //   };
  //   try {
  //     if (state.id == null) {
  //       const res = await request("category", "post", data); // Await the asynchronous request
  //     } else {
  //       const res = await request("category", "put", data); // Await the asynchronous request
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch categories:", error);
  //   }
  //   console.log(state);
  // };

  const onFinish = async (item) => {
    console.log(item)
    var data = {
      id: formrefe.getFieldValue("id"),
      name: item.name,
      description: item.description,
      status: item.status,
      parent_id: item.parent_id,
    };
    var method = "post";
    if (formrefe.getFieldValue("id")) {
      //Cause Update
      method = "put";
    }
    try {
      const res = await request("category", method, data);
      if (res && !res.error) {
        message.success(res.message);
        getlist();
        oncloseModule();
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
    console.log(item);
    // alert(JSON.stringify(item));
  };
  return (
    <MainPage loading={loading}>
      {/* <h1>CategoryPage-{list.length}</h1>
      <h1>{list.length > 0 && list[1].Name}</h1> */}

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
          <div className="">Category</div>
          <Input.Search
            style={{ marginLeft: 10 }}
            placeholder="Search"
          ></Input.Search>
        </div>
        <Button type="primary" icon={<MdAdd />} onClick={onClickAddbtn}>
          New
        </Button>
      </div>
      <Modal
        open={state.visblaModule}
        title={formrefe.getFieldValue("id") ? "Edit category" : "New category"}
        footer={null}
        onCancel={oncloseModule}
      >
        {/* <Input
          placeholder="Name"
          value={state.Name}
          onChange={(e) => {
            setState({
              ...state,
              Name: e.target.value,
            });
          }}
        />
        <Input
          placeholder="Description"
          value={state.Description}
          onChange={(e) => {
            setState({
              ...state,
              Description: e.target.value,
            });
          }}
        />
        <Input
          placeholder="Status"
          value={state.Status}
          onChange={(e) => {
            setState({
              ...state,
              Status: e.target.value,
            });
          }}
        />
        <Input
          placeholder="Parent_id"
          value={state.Parent_id}
          onChange={(e) => {
            setState({
              ...state,
              Status: e.target.value,
            });
          }}
        /> */}

        <Form layout="vertical" onFinish={onFinish} form={formrefe}>
          <Form.Item name={"name"} label="Name">
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item name={"description"} label="Description">
            <Input.TextArea placeholder="Description" />
          </Form.Item>
          <Form.Item name={"status"} label="Status">
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
            <Button onClick={oncloseModule}>Cacel</Button>
            <Button htmlType="submit" type="primary">
              {formrefe.getFieldValue("id") ? "Update" : "Save"}
            </Button>
          </Space>
        </Form>
      </Modal>
      <Table
        dataSource={list}
        columns={[
          {
            title: "No",
            // dataIndex: "Name",
            key: "No",
            render: (item, data, index) => index + 1,
          },
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Description",
            dataIndex: "description",
            key: "description",
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
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
      />
    </MainPage>
  );
}
