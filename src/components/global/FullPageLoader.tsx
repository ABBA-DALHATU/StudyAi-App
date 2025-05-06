import LoaderSpinner from "./LoaderSpinner";
import React from "react";

export const FullPageLoader = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoaderSpinner />
    </div>
  );
};

export default FullPageLoader;
