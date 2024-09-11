import React, { useContext } from 'react';
import { UserContext } from '../context/User';


const ProtectAdmin = ({component: Component, ...rest}) => {
    const {isAuthorized, user } = useContext(UserContext)

    if (user?.is_superuser) {
        return <Component {...rest} />
    } else {
        return (
            <div style={{textAlign: "center"}}>
                <h1>Not Authorized</h1>
            </div>
        )
    }

}
export default ProtectAdmin