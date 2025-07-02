import React from "react";
import Header from "../component/header";
import Packages from "../Views/packages";
import Spinner from "../component/spinner";
import { useState, useEffect } from "react";

const HomePage = () => {
   const [loading, setLoading] = useState(true)
      useEffect(() => {
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1500); 
        return () => clearTimeout(timer);
      }, []);
    
      if (loading) {
        return <Spinner />;
      }
  return (
    <>
      {" "}
      <Header />
      <div className="bg-bgrnd-0 min-h-screen overflow-hidden xs:min-h-screen ">
        <Packages />
      </div>
    </>
  );
};

export default HomePage;
