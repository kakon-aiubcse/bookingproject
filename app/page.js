import React from "react";
import Home from "../pages/home";
import Header from "../pages/component/header";

export default function page() {
  return(<>
  <div className="flex flex-col h-dvh">
    <Header/>
 <Home/>
  </div>

  
  </>)
}