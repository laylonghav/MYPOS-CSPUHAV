// MyDocument.jsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "pink",
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
});

const MyDocument = () => {
  const data = [
    { id: 1, name: "You can add multiple pages and customize the layout!" },
    { id: 2, name: "You can add multiple" },
    { id: 3, name: "This is another sample line" },
    { id: 4, name: "React PDF Renderer is powerful!" },
  ];

  return (
    
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Hello from React PDF Renderer!</Text>
          <Text style={styles.text}>
            This is a simple example of using @react-pdf/renderer to generate a
            PDF in React.
          </Text>
        </View>
        {data.map((item, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.text}>{item.name}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default MyDocument;
