import LoaderSpinner from "@/components/global/LoaderSpinner";
import React from "react";

type Props = {};

const loading = (props: Props) => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoaderSpinner />
    </div>
  );
};

export default loading;
