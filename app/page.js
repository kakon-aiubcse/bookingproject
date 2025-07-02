"use client";


import React from "react";
import Home from "../pages/home";
import Header from "../pages/component/header";
import { useState, useEffect } from "react";
import Spinner from "../pages/component/spinner"

export default function page() {
  const [loading, setLoading] = useState(true)
    useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000); 
      return () => clearTimeout(timer);
    }, []);
  
    if (loading) {
      return <Spinner />;
    }
  return (
    <>
      <div className="flex flex-col h-dvh xs:hidden">
        <Header />
        <Home />
      </div>
      <div className="hidden  xs:flex xs:flex-col xs:bg-bgrnd-0 xs:overflow-hidden">
        <Header/>
        <Home/>
      </div>
    </>
  );
}
