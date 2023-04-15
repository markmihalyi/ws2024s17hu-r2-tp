import React from "react";
import DataContext from "../providers/DataProvider";

const useData = () => {
  const data = React.useContext(DataContext);
  return data;
};

export default useData;
