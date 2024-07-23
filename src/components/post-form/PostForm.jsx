import React, {useCallback, useEffect} from 'react'
import { useForm  } from 'react-hook-form'
import {Button, Select, Input, RTE } from '../index'
import { useNavigate } from 'react-router-dom'
import appwriteService from '../../appwrite/mainConfig'
import { useSelector } from 'react-redux'


function PostForm({post}) {

    const navigate = useNavigate()
    // const [image, setImage] = useState(null);

    const {register, handleSubmit, watch, setValue, control, getValues, formState:{errors}} = useForm({
        defaultValues:{
            title:post?.title || '' ,
            slug: post?.slug ||'',
            content: post?.content || '',
            status: post?.status || '',
        }
    })

    const userData = useSelector(state => state.auth.userData)

    const submit = async (data) => {
        if(post){
            const file = data.image[0] ? appwriteService.uploadFile(data.image[0]) : null
            if (file){
                appwriteService.deleteFile(post.featuredImage)

            }
            const dbPost = await appwriteService.updatePost(post.$id, {...data, featuredImage: file ? file.$id : undefined})

            if(dbPost){
                navigate(`/post/${dbPost.$id}`)
            }
        }else{
            // console.log("else is executed")
            // console.log(data.image)
                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null
                // console.log(file)
                if(file){
                    const fileId = file.$id;
                    console.log("fileId: ",fileId)
                    console.log("featured Image: ",data.featuredImage)
                    data.featuredImage = fileId;
                    // console.log(data)
                    // console.log(fileId)
                    const dbPost = await appwriteService.createPost({
                        ...data,
                        featuredImage: fileId,
                        userId: userData.$id
                    })
                    if(dbPost){
                        navigate(`/post/${dbPost.$id}`)
                    }
            }
        }
    }

    const slugTransform = useCallback((value)=>{
        if(value && typeof(value) == 'string') return value
        .trimEnd()
        .toLowerCase()
        .replace(/[^\w\s]/g, '-')
        .replace(/\s+/g, '-')

            return ''
        },[])

    useEffect(()=>{
        const subscription = watch((value,{name})=>{
            if(name === 'title'){
                setValue('slug',slugTransform(value.title,{shouldValidate:true}))
        }})
        return subscription.unsubscribe()
    },[watch,slugTransform,setValue])


    return (
        <form onSubmit={handleSubmit(submit,(errors)=>{
            console.log(errors)
        })} className="flex flex-wrap">
            <div className="w-2/3 px-2">
            {errors.title && <p className='text-red-600 mt-8 text-center'>{errors.title.message}</p>}
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4 w-full rounded-xl py-2 px-2"
                    {...register("title", { required: 'Title is Required' })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
            {errors.slug && <p className='text-red-600 mt-8 text-center'>{errors.slug.message}</p>}
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4 w-full rounded-xl py-2 px-2"
                    {...register("slug",{required:'Slug is Required'})}
                    readOnly={true}
                    
                    
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
            {errors.image && <p className='text-red-600 mt-8 text-center'>{errors.image.message}</p>}
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4 w-full rounded-xl py-2 px-2 bg-white"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post ? 'Image is Required' : false })}
                />
                {post && post.featuredImage && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                {errors.status && <p className='text-red-600 mt-8 text-center'>{errors.status.message}</p>}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    classname="mb-4 w-full rounded-xl py-2 px-2"
                    {...register("status", { required: 'Status is Required' })}
                />
                <Button children={post ? "Update" : "Submit"} type="submit" bgColor={post ? "bg-green-500" : "bg-blue-600"} classname="w-full  rounded-xl py-2" />
            </div>
        </form>
    );
}

export default PostForm