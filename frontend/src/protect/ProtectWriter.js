import React, { useContext } from "react";
import { UserContext } from "../context/User";


const ProtectWriter = ({component: Component, ...rest}) => {
    const {isAuthorized, user } = useContext(UserContext)

    if (user?.profile?.is_writer) {
        return <Component {...rest} />
    } else {
        return (
            <div style={{textAlign: "center"}}>
                <h1>Not Authorized. Writers Only</h1>
            </div>
        )
    }

}
export default ProtectWriter