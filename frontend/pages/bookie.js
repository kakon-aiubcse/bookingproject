import React from "react";
import Link from "next/link";
import Header from "./component/header";
import ShowBookings from "./showbookings";

const HomePage = () => {
  return (
    <div>
      <Header />

      <ShowBookings />
    </div>
  );
};

export default HomePage;
