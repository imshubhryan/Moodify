import { useState } from "react";
import { createContext } from "react";

export const SongContext = createContext();

export const SongContextProvider = ({ children }) => {
  const [song, setSong] = useState({
    url: "https://ik.imagekit.io/uv5inemto/moodify/songs/Jab_Talak-_Fun2Desi.Com__hs8ThMxJsw.mp3",
    posterUrl:
      "https://ik.imagekit.io/uv5inemto/moodify/posters/Jab_Talak-_Fun2Desi.Com__5Zu8gF4fG.jpeg",
    title: "Jab Talak-(Fun2Desi.Com)",
    mood: "happy",
  });


  const [loading, setLoading] = useState(false)

  return (
    <SongContext.Provider value={{loading,setLoading,song,setSong}}>
        {children}
    </SongContext.Provider>
  )
};
