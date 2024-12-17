import React from 'react'
import NavbarUsers from '../NavbarUsers'
import SidebarUsers from '../SidebarUsers'

const LayoutUsers = ({children}) => {
  return (
    <React.Fragment>
        <NavbarUsers/>
        <div className="columns mt-6" style={{minHeight: "100vh"}}>
            <div className="column is-2">
                <SidebarUsers/>
            </div>
            <div className="column has-background-light">
                <main>{children}</main>
            </div>
        </div>
    </React.Fragment>
  )
}

export default LayoutUsers