import React, {useState} from 'react'
import authService from '../appwrite/auth'
import { login as authLogin } from '../store/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {useForm, } from 'react-hook-form'
import {Button, Logo, Input} from './index'

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit, formState:{errors}} = useForm()
    const [error, setError] = useState('')
    const login = async(data)=>{
        console.log("login")
        setError('')
        try {
            const session = await authService.login(data)
            if (session){
                const userData = await authService.getCurrentUser()
                if (userData) dispatch(authLogin(userData));
                navigate('/')
            }
        } catch (error) {
            setError(error.message)
        }
    }


  return (
    <div className='flex items-center justify-center w-full'>
        <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
            <div className="mb-2 flex justify-center">
                <span className="inline-block w-full max-w-[100px]">
                    <Logo width='100%'/>
                </span>
            </div>
            <h2 className="text-center text-2xl font-bold leading-tight">Sign in into your account</h2>
            <p className="mt-2 text-center text-base text-black/60">
                Don&apos;t have an account? &nbsp;
                <Link 
                to='/signup'
                className="font-medium text-primary transition-all duration-200 hover:underline">
                    Sign up
                </Link>

            </p>
            {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}


            <form onSubmit={handleSubmit(login,(errors)=>{
                console.log(errors)
            })} className='mt-8' >

                <div className='space-y-5'>
                {errors.email && <p className='text-red-600 mt-8 text-center'>{errors.email.message}</p>}
                    <Input 
                    label='Email' 
                    placeholder='Enter your Email' 
                    type='email' 
                    {...register("email", {
                        required:'Email is required',
                        validate:{
                            matchPattern: (value)=>/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || "Email Address must be a valid address"
                        }
                        })} />

                    {errors.password && <p className='text-red-600 mt-8 text-center'>{errors.password.message}</p>}

                    <Input 
                    label='Password' 
                    placeholder='Enter Your Password'
                    type='password'
                    {...register('password', {
                        required:'Password is required'
                        // validate:(value)=>/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value) || "Enter a valid Password"

                    })} />

                    <Button children={'Sign in'} type="submit" classname='inline-bock px-6 py-2 duration-200 hover:bg-blue-500 rounded-full w-full' />
                </div>
                
            </form>
        </div>
        
    </div>
  )
}

export default Login