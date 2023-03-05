// Validate username
import toast from 'react-hot-toast'
import {authenticate} from '../helper/helper'

// Validate login page username

export async function usernameValidate(values){
    const error = usernameVerify({}, values)
   
    if(values.username){
        // check user exist
        const { status } = await authenticate(values.username);
        
        if(status !== 200){
            error.exist = toast.error('User does not exist....!')
        }
    }
   
    return error;
}

export async function passwordValidate(values){
    const error = passwordVerify({}, values)
    return error;
}

export async function resetPasswordValidate(values){
   const errors = passwordVerify({}, values);
   if(values.password !== values.confirm_password){
        errors.exist = toast.error("Password not match...!");
   }
    return errors;
}


// Validate Register form
export async function registerValidate(values){
    const errors = usernameVerify({}, values);
    passwordVerify(errors, values);
    emailVerify(errors, values);
    return errors;
   
 }

//  Validate Profile
export async function profileValidate(values){
    const errors = emailVerify({}, values);
    
    return errors;
   
 }

 /* --------------- Reused Funcations ----------------  */
 function emailVerify(error = {}, values){
    
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    
    if(!values.email){
        error.email = toast.error('Email Required...!');
    }else if(values.email.includes('')){
        error.email = toast.error('Wrong Email...!');
    }else if(!emailRegex.test(values.email)){
        error.email = toast.error('Invalid Email...!');
    }

    return error;
 }

function passwordVerify(errors = {}, values){
    
    console.log(values.password)
    const specialChars = /[`!@#$%^&*()_+\~=\[\]{};':"\\|,.<>\/?~]/;
  
    if(!values.password){
        errors.password = toast.error('Password Required...!');
    }else if(values.password.includes(" ")){
        errors.password = toast.error('Invalid Password...!');
    }else if(values.password.length < 4){
        errors.password = toast.error('Password must be more than 4 character...!');
    }else if(!specialChars.test(values.password)){
        errors.password = toast.error('Password must have special characters...!');
    }

    return errors;
}

function usernameVerify(error = {}, values){
    if(!values.username){
        error.username = toast.error('Username Required...!');
    }else if(values.username.includes('')){
        error.username = toast.error('Invalid Username...!')
    }

    return error;
}