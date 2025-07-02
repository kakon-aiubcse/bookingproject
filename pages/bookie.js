import React from "react";
import Header from "./component/header";
import ShowBookings from "./showbookings";
import Spinner from "./component/spinner";
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
  return (<> 
      <Header />
<div className="min-h-screen bg-bgrnd-0" >
      <ShowBookings />
    </div>
  </>
   
  );
};

export default HomePage;
