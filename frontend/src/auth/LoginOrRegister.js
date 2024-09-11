import React, { useContext } from "react"
import { UserContext } from "../context/User"
import Login from "./Login"
import Register from "./Register"

function LoginOrRegister({ hasAnAccount, setHasAnAccount}) {
    const {loginOrRegisterIsOpen, setLoginOrRegisterIsOpen} = useContext(UserContext)
console.log(hasAnAccount, "has an account")
    return (
        <div>
            {
                hasAnAccount 
                ? 
                <Login 
                loginOrRegisterIsOpen={loginOrRegisterIsOpen}
                setLoginOrRegisterIsOpen={setLoginOrRegisterIsOpen}
                setHasAnAccount={setHasAnAccount}
                /> 
                : 
                <Register 
                loginOrRegisterIsOpen={loginOrRegisterIsOpen}
                setLoginOrRegisterIsOpen={setLoginOrRegisterIsOpen}
                setHasAnAccount={setHasAnAccount}
                />
            }

        </div>
    )
}
export default LoginOrRegister