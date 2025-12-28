import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../src/assets/assets";
import axios from 'axios'
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.withCredentials = true;
export const AppContextData = createContext();

const AppContext = (props) => {

   const navigate = useNavigate()
   const [user, setUser] = useState(null);
   const [chats, setChats] = useState([]);
   const [selectedChat, setSelectedChat] = useState(null);
   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
   const [loadingUser, setLoadingUser] = useState(true)
   const [token, setToken] = useState(localStorage.getItem('token' || null));
   const fetchUser = async () => {
      try {
         const { data } = await axios.get("/api/user/auth/profile");
         if (data?.user) {
            setUser(data.user);
         }
         else {

            toast.error(error.message);
         }
      } catch (error) {
         toast.error(error.message);
      }
      finally {
         setLoadingUser(false);
      };
   }

   const createNewChat = async () => {
      try {
         if (!user) return toast("login to create chat")
         navigate("/")
         await axios.get("api/chat/create")
         await fetchUserChat()
      } catch (error) {
         toast.error(error.message)
      }
   };

   const fetchUserChat = async () => {
      try {
         const { data } = await axios.get("/api/chat/get");

         if (data?.chats) {
            setChats(data.chats);

            if (data.chats.length === 0) {
               await createNewChat();
               return fetchUserChat()
            }
            else {
               setSelectedChat(data.chats[0])
            }
         }
         else {
            toast.error(data.message)
         }
      } catch (error) {
         toast.error(error.message)

      }
   };

   useEffect(() => {
      if (token) {
         fetchUser();
      } else {
         setUser(null)
         setLoadingUser(false)
      }
   }, [token]);



   useEffect(() => {
      if (theme === 'dark') {
         document.documentElement.classList.add('dark')
      }
      else {
         document.documentElement.classList.remove('dark')
      }
      localStorage.setItem('theme', theme)
   }, [theme])
   const value = { navigate, user, setUser, fetchUser, chats, setChats, selectedChat, setSelectedChat, theme, setTheme, loadingUser, setLoadingUser, createNewChat, fetchUserChat, axios, token, setToken };

   return (
      <AppContextData.Provider value={value}>
         {props.children}
      </AppContextData.Provider>
   );
};
export default AppContext;
