import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import {useFormik} from 'formik'
import {profileValidate} from '../helper/validate'

import convertToBase64 from '../helper/convert'

import avatar from '../assets/profile.png'
import styles from '../styles/Username.module.css'
import extend from '../styles/Profile.module.css'


export default function Profile() {

  const [file, setFile] = useState()
  
  const formik = useFormik({
    initialValues:{
      firstName : '',
      lastName : '',
      email : 'admin@gmail.com',
      mobile : '',
      address : ''
    },
    validate: profileValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values =>{
     values = await Object.assign(values, {profile: file || ''})
      console.log(values)
    }
  })
  
  // Image Upload
  const onUpload = async e => {
      const base64 = await convertToBase64(e.target.files[0]);
      setFile(base64)
  }

  return (
    <div className='container mx-auto'>

      <Toaster position='top-center' reverseOrder={false}></Toaster>

        <div className='flex justify-center items-center h-screen'>
            <div className={`${styles.glass} ${extend.glass}`} style={{width:'50%'}}>
              <div className='title flex flex-col items-center'>
                  <h4 className='text-5xl font-bold'>Profile</h4>
                  <span className='py-4 text-xl w-2/3 text-center text-grey-500'>
                   You can update the details. 
                  </span>
              </div>
              <form className='py-1' onSubmit={formik.handleSubmit}>
                <div className='profile flex justify-center py-4'>
                    <label htmlFor='profile'>
                       <img src={file || avatar} className={`${styles.profile_img} ${extend.profile_img}`} alt='avatar'></img>
                    </label>
                    <input type='file' id='profile' name='profile' onChange={onUpload} />
                </div>
                <div className='textbox flex flex-col items-center gap-6'>
                  <div className='name flex w-3/4 gap-10'>
                     <input type='text' {...formik.getFieldProps('firstName')} className={`${styles.textbox} ${extend.textbox}`} placeholder='First Name' />
                     <input type='text' {...formik.getFieldProps('lastName')} className={`${styles.textbox} ${extend.textbox}`} placeholder='Last Name' />
                  </div>

                  <div className='name flex w-3/4 gap-10'>
                     <input type='number' {...formik.getFieldProps('mobile')} className={`${styles.textbox} ${extend.textbox}`} placeholder='Mobile Number' />
                     <input type='email' {...formik.getFieldProps('email')} className={`${styles.textbox} ${extend.textbox}`} placeholder='Email Address' />
                  </div>

                     <input type='text' {...formik.getFieldProps('address')} className={`${styles.textbox} ${extend.textbox}`} placeholder='Address' />
                     <button type='submit' className={styles.btn}>Update</button>
                </div>
                <div className='text-center py-4'>
                    <span className='text-grey-500'>Come back later? <Link to='/logout' className='text-red-500'>Logout</Link> </span>
                </div>
              </form>

            </div>
        </div>
    </div>
  )
}
