import React, { useContext } from 'react';
import { UserContext } from '../context/User';
import Button from '@mui/material/Button';
import LoginOrRegister from '../auth/LoginOrRegister';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { isAuthorized, setLoginOrRegisterIsOpen, loginOrRegisterIsOpen} = useContext(UserContext);

    if (isAuthorized) {
        return <Component {...rest} />;
    } else {
        return (
            <div>
                {loginOrRegisterIsOpen && <LoginOrRegister />}
                Not authorized. please <Button onClick={() => setLoginOrRegisterIsOpen(true)}>Login</Button>
            </div>
        )
    }
};

export default ProtectedRoute;