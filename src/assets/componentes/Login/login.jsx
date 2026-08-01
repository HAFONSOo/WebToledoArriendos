import React, { useState } from 'react';
import supabase from '../../services/supabaseClient';
import {useNavigate} from 'react-router-dom'


const Login = () => {
    //inicializamos dos variables como array donde usamos usestate para devolver el array vacio la salida de esto seria  ""
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const navigate= useNavigate();
    const manejarSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email:email,
                password:password,
            });
            if(error){
                throw error
            }
          
            navigate('/admin')
           
        } catch (error) {
            console.error('Hubo un error inesperado',error)
        }
    };

  return <>
  
    <section>
        <form onSubmit={manejarSubmit}>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value) } placeholder='Email' />
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}placeholder='contrase'/>
            <button type="submit"> Enviar </button>

        </form>

    </section>
  
  
  
  
  </>
};

export default Login;
