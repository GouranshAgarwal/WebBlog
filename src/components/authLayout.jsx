import React,{useState, useEffect} from 'react'
import authService from '../appwrite/auth'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
function Protected({children, authentication = true}) {
    const authStatus = useSelector(state => state.auth.status)
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)

    useEffect(()=>{
        if(authentication && authStatus !== authentication ){
            navigate('/login')
        }else if(!authentication && authStatus !== authentication ){
            navigate('/')
        }
        setLoader(false)
    },[navigate, authStatus, authentication])

  return loader?<h1>Loading...</h1>:<>{children}</>
}

export default Protected