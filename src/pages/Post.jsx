import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import appwriteService from '../appwrite/mainConfig'
import { Button,Container } from '../components'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import parse from 'html-react-parser'

function Post() {
    const [post, setPost] = useState([])
    const [image, setImage] = useState(null)
    const userData = useSelector((state)=>state.auth.userData)
    const {slug} =  useParams()
    const navigate = useNavigate()

    const isAuthor = post && userData ? post.userId === userData.$id : false;
    // console.log("isAuthor: ",isAuthor)
    useEffect(()=>{
        // console.log("useEffect: ",slug)
        if(slug){
            appwriteService.getPost(slug).then((post)=>{
                if(post) setPost(post);
                else navigate('/');
                });
        }else{
            navigate('/')
        }
    },[slug,navigate])


    useEffect(() => {
        if (post.featuredImage) {
            const imageURL = appwriteService.getFilePreview(post.featuredImage);
            imageURL && setImage(imageURL.toString());
        }
    }, [post]);

    const deletePost = ()=>{
        appwriteService.deletePost(post.$id).then((status)=>{
            if(status){
                appwriteService.deleteFile(post.featuredImage);
                navigate('/');
            }
        });
    }

    // const image = appwriteService.getFilePreview(post.featuredImage)
    console.log(typeof(image), image)


    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    <img
                        src={image}
                        alt={post.title}
                        className="rounded-xl"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                <div className="browser-css">
                    {post.content?parse(post.content):''}
                    </div>
            </Container>
        </div>
    ) : null;
}

export default Post