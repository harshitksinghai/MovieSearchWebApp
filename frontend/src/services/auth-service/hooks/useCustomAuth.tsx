import { useEffect, useState } from "react";
import { authApi } from "../api/authApi";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { setUserId } from "@/redux/auth/authSlice";

export const useCustomAuth = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userId);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const res = await authApi.checkAuthentication();
        console.log("useCustomAuth: res: ", res)
        if(!res.data.util){
          dispatch(setUserId(null));
          return;
        }
        dispatch(setUserId(res.data.util));
      } catch (error) {
        console.log("Error: useCustomAuth: ", error);
        dispatch(setUserId(null));
      }
      finally {
        setLoading(false);
      }
    };
    fetchAuth();
  }, []);

  return {
    userId,
    loading
  };
};