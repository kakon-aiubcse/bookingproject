import React from "react";
import Link from "next/link";
import Header from "./component/header";
import ShowBookings from "./showbookings";

const HomePage = () => {
  return (<> 
      <Header />
<div className="h-dvh" >
      <ShowBookings />
    </div>
  </>
   
  );
};

export default HomePage;
