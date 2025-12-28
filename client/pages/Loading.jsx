import React, { useContext, useEffect } from 'react'
import  { AppContextData } from '../context/AppContext'

const Loading = () => {
  const { fetchUser ,navigate} = useContext(AppContextData)
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUser()
      navigate("/")
    }, 8000)
    return () => clearTimeout(timeout)
  }, [])
  return (
    <div className='bg-gradient-to-b from- [#531B81] to-[#29184B] backdrop-opacity-60 flex items-center justify-center h-screen w-screen text-white text-2xl'>
      <div className='h-10 w-10 rounded-full border-3 border-white animate-spin'></div>
    </div>
  )
}

export default Loading;