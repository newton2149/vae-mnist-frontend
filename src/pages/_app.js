import "@/styles/globals.css";
import AppContext from  "../components/AppContext"
import { useState } from "react";

export default function App({ Component, pageProps }) {
  const [imageSrc, setImageSrc] = useState("");

  
  return (
    <AppContext.Provider value={{imageSrc:imageSrc,setImageSrc:setImageSrc}}>
    <div>
      <div>
      <h1
        className="font-extrabold text-3xl text-white bg-gradient-to-r pt-4 from-[#f46b45] to-[#eea849]  
         text-center"
      >
        Number Predictor Using Variationol AutoEncoder
      </h1>
      </div>
      
      <Component {...pageProps} />
    </div>
    </AppContext.Provider>
  );
}
