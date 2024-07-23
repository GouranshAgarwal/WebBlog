import React, { useId } from 'react'

function Select({
    options,
    classname = '',
    label,
    ...props
}, ref) {
    const id = useId()


  return (
    <div className='w-full'>
        {label && <label htmlFor='id' className=''></label>}
        <select {...props} id={id} ref={ref} className={`mb-4 w-full rounded-xl py-2 px-2 ${classname}`}>
            {options?.map((item)=>(
                <option key={item} value={item} >
                    {item}
                </option>
            ))}
        </select>
    </div>
  )
}

export default React.forwardRef(Select) 