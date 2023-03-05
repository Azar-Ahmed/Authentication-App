
import React from 'react'
import {Link} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import {useFormik} from 'formik'
import {resetPasswordValidate} from '../helper/validate'

import styles from '../styles/Username.module.css'

export default function Reset() {
 
  const formik = useFormik({
    initialValues:{
      password : '',
      confirm_password: ''
    },
    validate: resetPasswordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values =>{
      console.log(values)
    }
  })
 
  return (
    <div className='container mx-auto'>

      <Toaster position='top-center' reverseOrder={false}></Toaster>

        <div className='flex justify-center items-center h-screen'>
            <div className={styles.glass} style={{width: '40%'}}>
              <div className='title flex flex-col items-center'>
                  <h4 className='text-5xl font-bold'>Reset</h4>
                  <span className='py-4 text-xl w-2/3 text-center text-grey-500'>
                    Explore new password.
                  </span>
              </div>
              <form className='pt-20' onSubmit={formik.handleSubmit}>
                <div className='textbox flex flex-col items-center gap-6'>
                  <input type='password' {...formik.getFieldProps('password')} className={styles.textbox} placeholder='New Password' />
                  <input type='password' {...formik.getFieldProps('confirm_password')} className={styles.textbox} placeholder='Confirm Password' />
                
                  <button type='submit' className={styles.btn}>Reset</button>
                </div>
                
              </form>

            </div>
        </div>
    </div>
  )
}
