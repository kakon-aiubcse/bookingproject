import React from "react";
import Header from "../component/header";
import Packages from "../Views/packages";

const HomePage = () => {
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
