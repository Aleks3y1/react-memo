import { useContext } from "react";
import { Context } from "../context/Context";

export const useCustomContext = () => {
  return useContext(Context);
};
