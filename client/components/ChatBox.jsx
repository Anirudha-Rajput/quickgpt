import React, { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../src/assets/assets";
import { AppContextData } from "../context/AppContext";
import Message from "./Message";
import toast from "react-hot-toast";

const ChatBox = () => {
  const containerRef = useRef(null)
  const { selectedChat, theme, user, setUser, axios } = useContext(AppContextData);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);
  const [prompt, setprompt] = useState("");
  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);
  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!user) return toast("login to send message")
      setLoading(true)
      const promptCopy = prompt
      setprompt('')
      setMessages(prev => [...prev, { role: "user", content: prompt, timestamp: Date.now(), isImage: false }])
      const { data } = await axios.post(`/api/message/${mode}/${selectedChat._id}`, { prompt, isPublished })
      if (data) {
        setMessages(prev => [...prev, data.reply])
        // decrease credits
        if (mode === 'text') {
          setUser(prev => ({ ...prev, credits: prev.credits - 2 }))
        }
        else {
          setUser(prev => ({ ...prev, credits: prev.credits - 1 }))

        }
      }
      else{
        toast.error(data.message)
        setprompt(promptCopy)
      }
    } catch (error) {
      toast.error(error.message)
      console.log("error", error)

    }finally{
        setprompt('')
        setLoading(false)
      }
  };

  useEffect(()=>{
    if(selectedChat){
      setMessages(selectedChat.messages)
    }
  },[selectedChat])
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }, [messages])
  return (
    <>

      <div className="flex-1  flex flex-col justify-between  m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
        {/*chat messages*/}
        <div ref={containerRef} className="flex-1  mb-5 overflow-y-scroll">
          {messages.length === 0 && (
            <div className="h-full   flex flex-col  items-center justify-center gap-2 text-primary">
              <img
                src={
                  theme === "dark" ? assets.logo_full : assets.logo_full_dark
                }
                className="w-full max-w-56 sm-max-w-68 "
              />
              <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white ">
                Ask me anything
              </p>
            </div>
          )}
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}

          {loading && (
            <div className="loader flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            </div>
          )}
        </div>
        {mode === "image" && (<label className="mx-auto inline-flex text-xs items-center gap-2 mb-3">
          <p>publish this image to community</p>
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
        </label>)}
        {/* promt input*/}
        <form onSubmit={onSubmit} className=' bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center' >
          <select
            onClick={(e) => {
              setMode(e.target.value);
            }}
            className="text-sm pl-3 pr-2 outline-none"
          >
            <option className="dark:bg-purple-900" value="text">
              text
            </option>
            <option className="dark:bg-purple-900" value="image">
              image
            </option>
          </select>
          <input
            placeholder="type your prompt here . . ."
            type="text"
            value={prompt}
            onChange={(e) => {
              setprompt(e.target.value);
            }}
            className="flex-1 text-sm w-full outline-none"
            required
          />
          <button className="" disabled={loading}>
            <img
              src={loading ? assets.stop_icon : assets.send_icon}
              className="w-8 cursor-pointer"
              alt=""
            />
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatBox;
