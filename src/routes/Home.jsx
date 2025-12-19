import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    const linkToRedirect = isLoggedIn ? "/system/user-manage" : "/login";
    navigate(linkToRedirect);
  }, [isLoggedIn]);

  return null;
};

export default Home;
