import {
    useEffect
} from 'react'

import logout from "../services/auth/logout"

const Logout = () => {
    useEffect(() => {
        logout()
    }, [logout])
    return (
        <>
        </>
    )
}

export default Logout