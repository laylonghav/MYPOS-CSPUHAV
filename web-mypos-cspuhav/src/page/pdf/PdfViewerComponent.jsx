// PdfViewerComponent.jsx
import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import MyDocument from "./MyDocument"; // Ensure this is correctly imported

const PdfViewerComponent = () => {
  return (
    <div style={{ height: "86vh" }}>
      <PDFViewer width="100%" height="100%">
        <MyDocument />
      </PDFViewer>
    </div>
  );
};

export default PdfViewerComponent;
