import React, { useState } from 'react';
import supabase from '../../services/supabaseClient';
import {useNavigate} from 'react-router-dom'
import adminImg from '/administrador.png';

const Login = () => {
    //inicializamos dos variables como array donde usamos usestate para devolver el array vacio la salida de esto seria  ""
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const [cargando, setCargando] = useState(false);
    const navigate= useNavigate();
    const manejarSubmit = async (e) => {
    
        e.preventDefault();
        setCargando(true);

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
        }finally {
            setCargando(false);
        }


    };

  return <>
  
    <section className='min-h-screen flex items-center justify-center bg-gray-100 '>
        <div className='bg-white p-4 rounded shadow-md w-full max-w-md  '>
            {/* imagen de administrador */}
            <div className='flex flex-col items-center mb-6'>
                <img  src={adminImg} alt="Logo Toledo" className='w-24 h-24 rounded-full object-cover border-4 border-yellow-500 shadow-sm mb-4'/>
            </div>
            <h2 className='text-2xl font-bold mb-4 text-center' >
                inicio sesión administrador
            </h2>

        <form onSubmit={manejarSubmit}  className='flex flex-col gap-2'>
            <input  className='border border-gray-300 focus:ring-yellow-500 transition-all w-full rounded  text-center p-1' type="email" value={email} onChange={(e)=>setEmail(e.target.value) } placeholder='Email' />
            <input  className='border border-gray-300 focus:ring-yellow-500 transition-all w-full rounded text-center p-1' type="password" value={password} onChange={(e)=>setPassword(e.target.value)}placeholder='Contraseña'/>
            <button className='w-full bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed' type="submit" disabled={cargando}>
                {cargando ? 'Cargando...' : 'Enviar'}
            </button>

        </form>
        </div>
    </section>
  
  
  
  
  </>
};

export default Login;
