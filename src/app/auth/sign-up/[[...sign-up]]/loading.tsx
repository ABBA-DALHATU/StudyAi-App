import LoaderSpinner from "@/components/global/LoaderSpinner";
import React from "react";

const loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoaderSpinner />
    </div>
  );
};

export default loading;
