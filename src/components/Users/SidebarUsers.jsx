import React from 'react'
import {NavLink} from "react-router-dom";
import { IoCloudUpload, IoHome, IoLogOut } from "react-icons/io5"

const SidebarUsers = () => {
  return (
    <div>
      <aside className="menu pl-2 has-shadow">
  <p classNameName="menu-label">General</p>
  <ul className="menu-list">
    <li>
        <NavLink to={"/dashboarduser"}><IoHome/> Dashboard</NavLink>
    </li>
    <li>
        <NavLink to={"/createuser"}><IoCloudUpload/> Create</NavLink>
    </li>
  </ul>
  <p className="menu-label">Settings</p>
  <ul className="menu-list">
    <li>
        <button className="button is-white"><IoLogOut/> Logout</button>
    </li>
  </ul>
</aside>
    </div>
  )
}

export default SidebarUsers
