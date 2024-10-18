import React, { useEffect, useState } from "react";
import { request } from "../../util/helper";
import { Modal,Button, Form, Input, message, Select, Space, Table, Tag } from "antd";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
export default function RolePage() {
  const [state, setState] = useState({
    list: [],
    loading: false,
    visible: false,
  });

  const [form] =Form.useForm();

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const res = await request("role", "get");
  // alert(JSON.stringify(res))
    if (res && !res.error) {

      setState((pre) => ({
        ...pre,
        list: res.list,
      }));
      // setState({
      //   ...state,
      //   list: res.list,
      //   visible:false,
      // });
    }
  };

  // const onClickDelete = () => {};
  const onClickDelete = async (data, index) => {
    Modal.confirm({
      title: "Remove",
      content: "Are you sure to remove ?",
      onOk: async () => {
        const res = await request("role", "Delete", {
          id: data.id,
        });

        if (res && !res.error) {
          const newlist = state.list.filter((item) => item.id != data.id);
           setState((pre) => ({
             ...pre,
             list: newlist,
           }));
          message.success(res.message);
        }
      },
    });

    // alert(JSON.stringify(res));
    console.log(data);
  };
  const onClickEdite = (item) => {
    form.setFieldsValue({
      ...item,
      // Name: item.Name,
      // code: item.code,
      // status: item.status,
    });
    onClickAddbtn();
  };
  const closeModul = () => {
    // setState({
    //   ...state,
    //   visible: false,
    // });

     setState((pre) => ({
       ...pre,
       visible: false,
     }));
    form.resetFields();
  };
  const onClickAddbtn = () => {
    setState((pre) => ({
      ...pre,
      visible: true,
    }));
  };

  const onFinish =async(item)=>{
    // alert(JSON.stringify(data));
    const data = {
      id:form.getFieldValue("id"),
      Name: item.Name,
      code: item.code,
      status: item.status,
    };

    var method = "post";
    if (form.getFieldValue("id")) {
      //Cause Update
      method = "put";
    }
    try {
      const res = await request("role", method, data);    
         if (res && !res.error) {
           message.success(res.message);
           getList();
           closeModul();
         } else {
           message.warning(res.error);
         }   
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
    console.log(item);


    // const res = await request("role","post",data);
   
  }

  return (
    <div>
      {/* <h1>RolePage</h1> */}
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
          <div className="">Role</div>
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
        title={form.getFieldValue("id") ? "Edit role" : "New role"}
        open={state.visible}
        onCancel={closeModul}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="Name" label="Role Name">
            <Input placeholder="Role Name"></Input>
          </Form.Item>
          <Form.Item name="code" label="Code">
            <Input placeholder="Code"></Input>
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
            <Button onClick={closeModul}>Cacel</Button>
            <Button htmlType="submit" type="primary">
              {form.getFieldValue("id") ? "Update" : "Save"}
            </Button>
          </Space>
        </Form>
      </Modal>

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
            dataIndex: "Name",
          },
          {
            key: "code",
            title: "Code",
            dataIndex: "code",
          },
          {
            key: "status",
            title: "Status",
            dataIndex: "status",
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
