import { useEffect } from 'react'

import { useDispatch } from 'react-redux'
import { logout as logoutAction } from '@store/authentication'

import logout from '@services/auth/logout'

const Logout = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        logout()
        dispatch(logoutAction())
    }, [])
    return (
        <>
            <h1>You have been logout</h1>
        </>
    )
}

export default Logout