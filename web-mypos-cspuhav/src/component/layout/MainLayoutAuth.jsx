import React from 'react'
import { Outlet } from 'react-router-dom'

export default function MainLayoutAuth() {
  return (
    <div>
      {/* <h1 style={{ backgroundColor: "pink" }}>MainLayoutAuth</h1> */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}
