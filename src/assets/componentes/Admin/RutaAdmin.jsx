import React, { useEffect, useState } from 'react';
import supabase from '../../services/supabaseClient';


const RutaAdmin = ({ children }) => {
  const [session,setSession]=useState(null);
  const [loading,setLoading]=useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(()=>{
    const verificarPermisos=async()=>{
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if(session){

          const { data: esAdmin } = await supabase
          .from('admins')
          .select('user_id')
          .eq('user_id', session.user.id)
          .maybeSingle();
         
          if(esAdmin){
                setIsAdmin(true)
        }
      }
      setLoading(false);
    };
    verificarPermisos();
         
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
      });
            return () => subscription.unsubscribe();
    },[])

  if(loading){
        return <p>Cargando...</p>
      }    
  if(!session){
    return <p>Por favor, incia sesion</p>
  }
 
  if(isAdmin){
    return <>{children}</>;
  }
  return <p>No tienes permiso de administrador...</p>
};

export default RutaAdmin;
