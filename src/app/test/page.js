'use client'

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../../../store/slices/loginSlice"

export default function TestComponent() {

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const dispatch = useDispatch();

  return (
    <div className="text">
      <h2>Test Component</h2>
      <p>Is Logged In: {isLoggedIn ? "Yes" : "No"}</p>
      <button className="btn" onClick={() => dispatch(login())}>Login</button>
      <button className="btn" onClick={() => dispatch(logout())}>Logout</button>
    </div>
  );
};