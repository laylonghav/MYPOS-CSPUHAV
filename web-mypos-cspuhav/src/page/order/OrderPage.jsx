import React, { useEffect, useState } from "react";
import moment from "moment";
import { formatDateClient, formatDateServer, request } from "../../util/helper";
import "react-slideshow-image/dist/styles.css"; // Import Slider from react-slick
import logo from "../../assets/Image/Logo/Mylogo.png";
import { TiEye } from "react-icons/ti";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";
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
  InputNumber,
  Col,
  Row,
  DatePicker,
  Image as AntdImage,
  Upload,
} from "antd";
import { MdAdd, MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import { configStore } from "../../store/configStore";
import { configs } from "../../util/config";
import dayjs from "dayjs";
import FileUpload from "../../component/Upload/FileUpload";
import PdfViewerComponent from "../pdf/PdfViewerComponent";
import { useNavigate } from "react-router-dom";

export default function OrderPage() {
  //   const { category } = configStore().config;
  //   const {category,role}=config;

 const styles = StyleSheet.create({
   page: {
     flexDirection: "column",
     backgroundColor: "#f9f9f9",
     padding: 20,
   },
   header: {
     fontSize: 16,
     marginBottom: 5,
     textAlign: "center",
     fontWeight: "bold",
     color: "#333",
   },
   subHeader: {
     fontSize: 12,
     textAlign: "center",
     color: "#777",
     marginBottom: 5,
   },
   table: {
     display: "flex",
     flexDirection: "column",
     borderWidth: 1,
     borderColor: "#ddd",
    //  marginBottom: 10,
    //  marginTop: 10,
   },
   tableRow: {
     flexDirection: "row",
     borderBottomWidth: 1,
     borderBottomColor: "#ddd",
     padding: 5,
   },
   tableHeader: {
     fontWeight: "bold",
     fontSize: 10,
     flex: 1,
     textAlign: "center",
     backgroundColor: "#f2f2f2",
    //  paddingVertical: 10,
   },
   tableCell: {
     fontSize: 8,
     flex: 1,
     textAlign: "center",
     paddingVertical: 8,
   },
   logo: {
     width: 60,
     height: 60,
    //  marginBottom: 20,
     alignSelf: "center",
   },
   companyInfo: {
     fontSize: 10,
     textAlign: "center",
     marginBottom: 10,
   },
   footer: {
     marginTop: 20,
     fontSize: 10,
     textAlign: "center",
     color: "#777",
   },
 });

 // Define the PDF Document
 const MyDocument = () => {
 

   return (
     <Document>
       <Page size="A4" style={styles.page}>
         {/* Company Logo and Info */}
         <Image style={styles.logo} src={logo} />
         <Text style={styles.header}>Computer Science PUHAV</Text>
         <Text style={styles.subHeader}>Order and Payment Report</Text>
         <Text style={styles.companyInfo}>
           123 Business Rd, Phnom Penh, Cambodia
           {"\n"}Phone: (123) 456-7890 | Email: laylonghav2023.com
         </Text>

         {/* Table Header */}
         <View style={styles.table}>
           <View style={styles.tableRow}>
             <Text style={styles.tableHeader}>No</Text>
             <Text style={styles.tableHeader}>Name</Text>
             <Text style={styles.tableHeader}>Tel</Text>
             <Text style={styles.tableHeader}>Address</Text>
             <Text style={styles.tableHeader}>Total </Text>
             <Text style={styles.tableHeader}>Paid</Text>
             <Text style={styles.tableHeader}>Payment</Text>
             <Text style={styles.tableHeader}>Remark</Text>
             <Text style={styles.tableHeader}>Created By</Text>
           </View>

           {/* Table Data */}
           {state.list?.map((item, index) => (
             <View key={index} style={styles.tableRow}>
               <Text style={styles.tableCell}>{item.order_no}</Text>
               <Text style={styles.tableCell}>{item.customer_name}</Text>
               <Text style={styles.tableCell}>{item.customer_tel}</Text>
               <Text style={styles.tableCell}>{item.customer_address}</Text>
               <Text style={styles.tableCell}>${item.total_amount}</Text>
               <Text style={styles.tableCell}>${item.paid_amount}</Text>
               <Text style={styles.tableCell}>{item.payment_method}</Text>
               <Text style={styles.tableCell}>{item.remark}</Text>
               <Text style={styles.tableCell}>{item.create_by}</Text>
             </View>
           ))}
         </View>

         {/* Footer */}
         <Text style={styles.footer}>
           Thank you for your business! For more information, visit our website
           or contact our support team.
         </Text>
       </Page>
     </Document>
   );
 };


  const { config } = configStore();
  const [form] = Form.useForm();
  const [state, setState] = useState({
    loading: false,
    visibleModule: false,
    list: [],
    total: [],
    totalAmount: [],
    totalAmountAll: [],
    dataCountAll: [],
  });
  const [listDetail, setListDetail] = useState([]);
  const [openView, setOpenView] = useState(false);
  const [openViewPdf, setViewPdf] = useState(false);
  const refPage = React.useRef(1);

  useEffect(() => {
    getlist();
  }, []);

  // State to manage the filter values
  const [filter, setFilter] = useState({
    txtsearch: "",
    customer: "",
    from_date: dayjs(),
    to_date: dayjs(),
  });

  // Function to fetch the list based on the filter
  const getlist = async () => {
    try {
      const param = {
        txtsearch: filter.txtsearch,
        customer: filter.customer,
        page: refPage.current,
        from_date: formatDateServer(filter.from_date),
        to_date: formatDateServer(filter.to_date),
      };

      // Make the API request
      const res = await request("order", "get", param);

      // Check if the response is structured as expected and contains the 'list' property
      if (res && res.list && Array.isArray(res.list)) {
        // Update the state with the fetched list
        setState((prev) => ({
          ...prev,
          list: res.list,
          totalAmount:
            refPage.current === 1 ? res.totalAmount : prev.totalAmount,
          total: refPage.current === 1 ? res.total : prev.total,
          totalAmountAll: res.totalAmountAll,
          dataCountAll: res.dataCountAll,
        }));
      } else if (res && res.message) {
        // If there's an error message from the server, log it
        console.error("Server response:", res.message);
      } else {
        // Handle unexpected structure if 'list' is missing
        console.error("Unexpected response structure:", res);
      }
    } catch (error) {
      // Catch any network or request-related errors
      console.error("Failed to fetch employee list:", error.message || error);

      // Optional: If you want to log additional error details, you can add this line
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
    }
  };

  const onClickEdit = async (data) => {
    form.setFieldsValue({
      ...data,
    });

    setState((prevState) => ({
      ...prevState,
      visibleModule: true,
    }));
  };

  const onClickView = async (data) => {
    const res = await request("order_detail/" + data.id, "get");
    if (res && res.list && Array.isArray(res.list)) {
      setListDetail(res.list);
      setOpenView(true);
    } else if (res && res.message) {
      console.error("Server response:", res.message);
    }
  };

  const onClickDelete = async (data, index) => {
    // alert(JSON.stringify(data));
    Modal.confirm({
      title: "Remove data",
      content: "Are you to remove ?",
      onOk: async () => {
        const res = await request("order", "delete", data);
        if (res && !res.error) {
          message.success(res.message);
          getlist();
        }
      },
    });
  };

  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        console.log(jsonData);
        setData(jsonData);
      };
      reader.readAsBinaryString(file);
    }
  };

  const exportToExcel = () => {
    // const data = state?.list?.map((item) => ({
    //   ...item,
    //   gender: item.gender == 1 ? "Male" : "Female",
    //   dob: formatDateClient(item.dob),
    //   create_at: formatDateClient(item.create_at),
    // }));

    const ws = XLSX.utils.json_to_sheet(state.list);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Order List");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "OrderList.xlsx");
  };

  const onClickNew = async () => {
    setState((p) => ({
      ...p,
      visibleModule: true,
    }));
  };

  const oncloseModule = () => {
    setState((p) => ({
      ...p,
      visibleModule: false,
    }));
    getlist();
    form.resetFields();
  };
  const oncloseView = () => {
    setOpenView(false);
  };
  const oncloseViewPdf = () => {
    setViewPdf(false);
  };
  const onOpenViewPdf = () => {
    setViewPdf(true);
  };

  const btnFilter = () => {
    refPage.current = 1; // Update page reference
    getlist(); // Fetch data for the new filter
  };

  const onFinish = async (data) => {
    console.log(data);
    var params = {
      ...data,
      id: form.getFieldValue("id"),
    };

    try {
      var method = form.getFieldValue("id") ? "put" : "post";
      const res = await request("order", method, params); // Change to "order"

      if (res && !res.error) {
        message.success(res.message);
        oncloseModule();
      }
    } catch (error) {
      console.error("Request failed:", error);
      message.error("An unexpected error occurred.");
    }
  };

  const navigate = useNavigate(); // Create navigate function

  const handleViewPdfClick = () => {
    navigate("/view-pdf"); // Redirect to the PdfViewerPage
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
          <div>
            Order {state.total + "/" + state.dataCountAll} |{" "}
            {"Total amount: " +
              state.totalAmount +
              "$" +
              "/" +
              state.totalAmountAll +
              "$"}
          </div>
          <Input.Search
            allowClear
            onChange={(event) =>
              setFilter((p) => ({
                ...p,
                txtsearch: event.target.value,
              }))
            }
            placeholder="Search"
          />

          {/* PDF Viewer */}
          <Modal
            style={{ top: 10 }}
            open={openViewPdf}
            header={null}
            footer={null}
            onCancel={oncloseViewPdf}
            height={900}
            width={900}
          >
            <div style={{ width: "100%", height: "850px", marginTop: 20 }}>
              <PDFViewer width="100%" height="100%">
                <MyDocument />
              </PDFViewer>
            </div>
          </Modal>

          {/* <PdfViewerComponent /> */}
          {/* <Button onClick={handleViewPdfClick} type="primary">
            View PDF
          </Button> */}
          <Select
            style={{ width: 250 }}
            placeholder="Customer"
            allowClear
            options={config.customer}
            onChange={(id) => {
              // alert(id);
              setFilter((p) => ({
                ...p,
                customer: id,
              }));
            }}
          />
          <DatePicker.RangePicker
            allowClear={false}
            defaultValue={[
              dayjs(filter.from_date, "YYYY-MM-DD"),
              dayjs(filter.to_date, "YYYY-MM-DD"),
            ]}
            onChange={(value) => {
              setFilter((pre) => ({
                ...pre,
                from_date: value[0],
                to_date: value[1],
              }));
            }}
          ></DatePicker.RangePicker>
          <Button onClick={btnFilter} type="primary">
            Filter
          </Button>
          <Button onClick={onOpenViewPdf} type="primary">
            View PDF
          </Button>
          {/* PDF Download Link */}
          <PDFDownloadLink document={<MyDocument />} fileName="example.pdf">
            {({ loading }) =>
              loading ? (
                "Loading document..."
              ) : (
                <Button type="primary" style={{  }}>
                  Download PDF
                </Button>
              )
            }
          </PDFDownloadLink>
          <Button type="primary" onClick={exportToExcel}>
            Export to Excel
          </Button>
          <Upload
            accept=".xlsx, .xls"
            showUploadList={false}
            beforeUpload={(file) => {
              handleFileUpload({ target: { files: [file] } });
              return false;
            }}
          >
            <Button type="primary">Import Excel</Button>
          </Upload>
        </Space>

        <Button
          className="hidden"
          type="primary"
          icon={<MdAdd />}
          onClick={onClickNew}
        >
          New
        </Button>
      </div>
      {/* <h1>{form.getFieldValue("id")}</h1> */}
      <Modal
        open={openView}
        title="Order Detail"
        footer={null}
        onCancel={oncloseView}
        width={1000}
      >
        {/* Table for displaying order details */}
        <Table
          dataSource={listDetail}
          columns={[
            {
              title: "Product Name",
              dataIndex: "p_name",
              key: "p_name",
            },
            {
              title: "Brand",
              dataIndex: "p_brand",
              key: "p_brand",
            },
            {
              title: "Category",
              dataIndex: "p_category_name",
              key: "p_category_name",
            },
            {
              title: "Image",
              dataIndex: "p_image",
              key: "p_image",
              render: (image) => (
                <div className="w-[150px] h-[100px] overflow-hidden object-fit-cover rounded-lg">
                  <AntdImage
                    className="w-[100%] h-[100%] object-fit-cover"
                    src={"http://localhost/fullstack/image_cspuhav/" + image}
                    alt="Product"
                    // style={{ width: 50, height: 50 }}
                  />
                </div>
              ), // Display image
            },
            {
              title: "Quantity",
              dataIndex: "qty",
              key: "qty",
            },
            {
              title: "Price",
              dataIndex: "price",
              key: "price",
              // render: (price) => `$${price.toFixed(2)}`, // Format price
            },
            {
              title: "Discount",
              dataIndex: "discount",
              key: "discount",
              render: (discount) => `${discount}%`, // Format discount
            },
            {
              title: "Total",
              dataIndex: "total",
              key: "total",
              // render: (total) => `$${total.toFixed(2)}`, // Format total
            },
          ]}
          rowKey="id" // Assuming each order detail has a unique ID
          pagination={false} // Disable pagination for simplicity
        />
        <Space style={{ marginTop: 16, justifyContent: "flex-end" }}>
          <Button onClick={oncloseView}>Close</Button>
        </Space>
      </Modal>

      <Modal
        open={state.visibleModule}
        title={form.getFieldValue("id") ? "Edit order" : "New order"}
        footer={null}
        onCancel={oncloseModule}
        width={600}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Row gutter={8}>
            <Col span={12}>
              {/* Order Details */}
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please input Order No",
                  },
                ]}
                name={"order_no"}
                label="Order No"
              >
                <Input
                  placeholder="Order No"
                  disabled={!!form.getFieldValue("id")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please select Customer",
                  },
                ]}
                name={"customer_id"}
                label="Customer"
              >
                <Select
                  placeholder="Select customer"
                  options={config.customer}
                  className="w-full"
                />
              </Form.Item>
              {/* <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please input customer telephone",
                  },
                ]}
                name={"customer_tel"}
                label="Telephone"
              >
                <Input placeholder="Telephone" />
              </Form.Item> */}
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please input Total Amount",
                  },
                ]}
                name={"total_amount"}
                label="Total Amount"
              >
                <Input type="number" placeholder="Total Amount" />
              </Form.Item>{" "}
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please input Paid Amount",
                  },
                ]}
                name={"paid_amount"}
                label="Paid Amount"
              >
                <Input type="number" placeholder="Paid Amount" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please select Payment Method",
                  },
                ]}
                name={"payment_method"}
                label="Payment Method"
              >
                <Select
                  placeholder="Select method pay"
                  options={[
                    { label: "Wing", value: "wing" },
                    { label: "ABA", value: "aba" },
                    { label: "ACLEDA", value: "acleda" },
                    { label: "TrueMoney", value: "truemoney" },
                    { label: "Pi Pay", value: "pipay" },
                    { label: "PayGo", value: "paygo" },
                    { label: "PrincePay", value: "princepay" },
                    { label: "Ly Hour Veluy", value: "lyhour" },
                    { label: "AMK Mobile Banking", value: "amk" },
                    { label: "Vattanac Bank", value: "vattanac" },
                    { label: "Canadia Bank", value: "canadia" },
                    { label: "Chip Mong Bank", value: "chipmong" },
                    { label: "E-money", value: "emoney" },
                    { label: "Cambodia Post Bank", value: "cpb" },
                  ]}
                  className="w-full"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input Remark",
              },
            ]}
            name={"remark"}
            label="Remark"
          >
            <Input.TextArea placeholder="Remark" />
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
        dataSource={state.list}
        pagination={{
          pageSize: 10,
          total: state.total,
          current: refPage.current, // Current page
          onChange: (page) => {
            // setFilter((pre) => ({ ...pre, page: page }));
            refPage.current = page;
            getlist();
          },
        }}
        /* `order_no`, `customer_id`, `user_id`, `total_amount`,
              `paid_amount`, `payment_method`, `remark`, `create_by`,
              `create_at` */
        columns={[
          {
            title: "No",
            // dataIndex: "Name",
            key: "No",
            render: (item, data, index) => index + 1,
          },
          {
            title: "Order no",
            dataIndex: "order_no",
            key: "order_no",
          },
          {
            title: "Customer",
            dataIndex: "customer_name",
            key: "customer_name",
          },
          {
            title: "Total amount",
            dataIndex: "total_amount",
            key: "total_amount",
            render: (value) => <Tag color="blue">{value + "$"}</Tag>,
          },
          {
            title: "Paid",
            dataIndex: "paid_amount",
            key: "paid_amount",
            render: (value) => (
              <div className="text-green-700 font-bold">{value + "$"}</div>
            ),
          },
          {
            title: "Due",
            dataIndex: "Due",
            key: "Due",
            render: (value, data) => (
              <Tag color="red">
                {(Number(data.total_amount) - Number(data.paid_amount)).toFixed(
                  2
                ) + "$"}
              </Tag>
            ),
          },
          {
            title: "Payment",
            dataIndex: "payment_method",
            key: "payment_method",
          },
          {
            title: "Remark",
            dataIndex: "remark",
            key: "remark",
          },
          {
            title: "Telephone",
            dataIndex: "customer_tel",
            key: "customer_tel",
          },
          {
            title: "Address",
            dataIndex: "customer_address",
            key: "customer_address",
          },
          {
            title: "Create at",
            dataIndex: "create_at",
            key: "create_at",
            render: (value) => formatDateClient(value, "YYYY-MM-DD"),
          },
          {
            title: "Create by",
            dataIndex: "create_by",
            key: "create_by",
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
                  onClick={() => onClickEdit(data, index)}
                ></Button>
                <Button
                  type="primary"
                  icon={<TiEye />}
                  onClick={() => onClickView(data, index)}
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
