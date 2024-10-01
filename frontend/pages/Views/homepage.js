import React from "react";
import Header from "../component/header";
import Packages from "../Views/packages";

const HomePage = () => {
  return (
    <>
      {" "}
      <Header />
      <div className="overflow-hidden h-[589px]">
        <Packages />
      </div>
    </>
  );
};

export default HomePage;
