import React, { forwardRef } from "react";
import { formatDateClient } from "../../util/helper";
import logo from "../../assets/Image/Logo/Mylogo.png";

const PrintInvoice = forwardRef((props, ref) => {
  const formattedDate = props.order_date
    ? formatDateClient(props.order_date, "DD-MM-YYYY HH:mm:ss A")
    : new Date().toLocaleString();

  const calculateTotal = () => {
    const subtotal = props.list_cart?.reduce(
      (total, item) =>
        total + item.cart_qty * item.price * (1 - item.discount / 100),
      0
    );
    return subtotal ? (subtotal * 1.1).toFixed(2) : "0.00";
  };

  const taxAmount = () => {
    const subtotal = props.list_cart?.reduce(
      (total, item) =>
        total + item.cart_qty * item.price * (1 - item.discount / 100),
      0
    );
    return subtotal ? (subtotal * 0.1).toFixed(2) : "0.00";
  };

  return (
    <div className="w-[220] p-4 font-mono text-sm " ref={ref}>
      {/* Header */}
      <div className="text-center border-b mb-2">
        <div className="flex justify-center items-center mb-2">
          <img
            src={logo}
            alt="Shop Logo"
            className="w-16 h-16 object-contain mr-2"
          />
          <div>
            <h1 className="text-lg font-bold text-gray-700">CSPUHAV SHOP</h1>
            <p className="text-xs text-gray-500">
              Samrong Krom, Kan Prek Phnov, Phnom Penh
            </p>
            <p className="text-xs text-gray-500">Phone: 0979266010</p>
            <p className="text-xs text-gray-500">Email: laylonghav@Gmail.com</p>
          </div>
        </div>
        {/* <h2 className="text-lg font-bold uppercase mt-4">Invoice</h2> */}
      </div>

      {/* Invoice Details */}
      <div className="mb-2 grid grid-cols-2 gap-x-20">
        <div>
          <p>
            <strong>Invoice:</strong> {props.order_no || "..................."}
          </p>
          <p>
            <strong>Date:</strong> {formattedDate}
          </p>
        </div>
        <div>
          <p>
            <strong>Customer:</strong>{" "}
            {props.customer || "..................."}
          </p>
          <p>
            <strong>Payment Method:</strong>{" "}
            {props.payment_method || "............."}
          </p>
        </div>
        <div className="col-span-2">
          <p>
            <strong>Remark:</strong>{" "}
            {props.remark ||
              "............................................................"}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-2">
        <table className="w-full border-2 border-gray-200 text-center">
          <thead>
            <tr className="text-center ">
              {["No", "Name", "Brand", "Qty", "Price", "Discount", "Total"].map(
                (header) => (
                  <th
                    key={header}
                    className="border-l-2 border-b border-l-gray-200 py-2 px-2 text-gray-700 font-medium"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {props.list_cart?.map((item, index) => (
              <tr key={index} className="text-gray-600">
                <td className="py-1 px-2   border-l-gray-100 border-b-2 border-b-gray-100">
                  {index + 1}
                </td>
                <td className="py-1 px-2 border-l-2 border-l-gray-100 border-b-2 border-b-gray-100">
                  {item.name}
                </td>
                <td className="py-1 px-2 border-l-2 border-l-gray-100 border-b-2 border-b-gray-100">
                  {item.brand}
                </td>
                <td className="py-1 px-2 border-l-2 border-l-gray-100 border-b-2 border-b-gray-100">
                  {item.cart_qty}
                </td>
                <td className="py-1 px-2 border-l-2 border-l-gray-100 border-b-2 border-b-gray-100">
                  ${item.price}
                </td>
                <td className="py-1 px-2 border-l-2 border-l-gray-100 border-b-2 border-b-gray-100">
                  {item.discount > 0 ? `${item.discount}%` : "No Discount"}
                </td>
                <td className="py-1 px-2 border-l-2 border-l-gray-100 border-b-2 border-b-gray-100">
                  $
                  {(
                    item.cart_qty *
                    item.price *
                    (1 - item.discount / 100)
                  ).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="">
        <p className="flex justify-between">
          <span>Subtotal:</span>
          <span>${calculateTotal()}</span>
        </p>
        <p className="flex justify-between">
          <span>Tax (10%):</span>
          <span>${taxAmount()}</span>
        </p>
        <p className="flex justify-between font-bold">
          <span>Grand Total:</span>
          <span>${calculateTotal()}</span>
        </p>
        <p className="flex justify-between">
          <span>Paid Amount:</span>
          <span>${props.paid_amount?.toFixed(2) || "0.00"}</span>
        </p>
        <p className="flex justify-between font-bold">
          <span>Remaining Amount:</span>
          <span>
            ${((props.total_amount || 0) - (props.paid_amount || 0)).toFixed(2)}
          </span>
        </p>
      </div>

      {/* Footer */}
      <div className="text-center border-t mt-2 pt-2 text-xs">
        <p>Thank you for shopping with us!</p>
        <p className="text-gray-500">Powered by CSPUHAV SHOP</p>
      </div>
    </div>
  );
});

export default PrintInvoice;
