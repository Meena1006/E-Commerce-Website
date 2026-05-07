import React from 'react'
import "./DefaultDisplay.css"
import Admin_panel from "../../assets/admin.png"
const DefaultDisplay = () => {
    return (
        <div className="default-image">
            <img
            src={Admin_panel}
                alt="Default Image"
                className="default-img"
            />
        </div>
    )
}

export default DefaultDisplay