import React, { useEffect, useState } from 'react'
import appwriteService from '../appwrite/mainConfig'
import { Container, PostForm } from '../components'
import { useNavigate, useParams } from 'react-router-dom'
function EditPost() {
    const [post, setPost] = useState([])
    const {slug} = useParams()
    const navigate = useNavigate()
    useEffect(()=>{
        if(slug){
            appwriteService.getPost(slug).then((post)=>{
                if(post){
                    setPost(post)
                }
            })
        }else{
            navigate('/')
        }
    },[slug, navigate])

    // console.log(post)

  return post?(<div className='py-8'>
    <Container>
        <PostForm post={post}/>
    </Container>
  </div>):null
}

export default EditPost