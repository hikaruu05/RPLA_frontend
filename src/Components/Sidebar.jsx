import React from 'react'
import {NavLink} from "react-router-dom";
import { IoPerson, IoCloudUpload, IoHome, IoLogOut } from "react-icons/io5"

const Sidebar = () => {
  return (
    <div>
      <aside className="menu pl-2 has-shadow">
  <p classNameName="menu-label">General</p>
  <ul className="menu-list">
    <li>
        <NavLink to={"/dashboard"}><IoHome/> Dashboard</NavLink>
    </li>
    <li>
        <NavLink to={"/Upload"}><IoCloudUpload/> Upload</NavLink>
    </li>
  </ul>
  <p className="menu-label">Admin</p>
  <ul className="menu-list">
    <li>
        <NavLink to={"/users"}><IoPerson/> Users</NavLink>
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

export default Sidebar
