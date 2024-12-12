import React from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const FileUpload = ({ handleFileUpload }) => {
  const uploadProps = {
    accept: ".xlsx, .xls", // Restrict file types
    beforeUpload: (file) => {
      handleFileUpload(file); // Call the upload handler
      return false; // Prevent automatic upload
    },
  };

  return (
    <Upload {...uploadProps}>
      <Button icon={<UploadOutlined />}>Upload Excel File</Button>
    </Upload>
  );
};

export default FileUpload;
