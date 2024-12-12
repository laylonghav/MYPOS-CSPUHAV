import React from "react";
import { Col, Row } from "antd";

export default function HomeGrid({ data = [] }) {
  return (
    <Row gutter={16}>
      {data?.map((item, index) => (
        <Col span={6} key={index}>
          <div
            style={{
              backgroundColor: "pink",
              padding: 15,
              margin: 2,
              borderRadius: 10,
              minHeight: 100,
            }}
          >
            <div style={{ fontSize: 26, fontWeight: "bold" }}>{item.title}</div>
            {/* <div>{item?.total}</div> */}
            {item.summary && Object.keys(item.summary).map((key,index)=>(
              <div key={index}>
                <div>
                  {key} : {item.summary[key]}
                </div>
              </div>
            ))}
          </div>
        </Col>
      ))}
    </Row>
  );
}
