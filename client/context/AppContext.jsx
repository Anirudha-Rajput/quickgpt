import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../src/assets/assets";

export const AppContextData = createContext();

const AppContext = (props) => {
   const navigate=useNavigate()
   const [user, setUser] = useState(null);
   const [chats, setChats] = useState([]);
   const [selectedChat, setSelectedChat] = useState(null);
   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
   const fetchUser=async()=>{
      setUser(dummyUserData)
   }
   useEffect(()=>{fetchUser()},[])
   const fetchUserChat=async()=>{
      setChats(dummyChats)
      setSelectedChat()
   }
  useEffect(()=>{
   if(user){
      fetchUserChat()
   }
   else{
      setChats([])
      setSelectedChat(null)
   }
  },[user])

 useEffect(()=>{
   if(theme==='dark'){
      document.documentElement.classList.add('dark')
   }
   else {
      document.documentElement.classList.remove('dark')
   }
   localStorage.setItem('theme',theme)
 },[theme])
   const value = {navigate,user,setUser,fetchUser,fetchUserChat,chats,setChats,selectedChat,setSelectedChat,theme,setTheme};

  return (
    <AppContextData.Provider value={value}>
      {props.children}
    </AppContextData.Provider>
  );
}; 
export default AppContext;
