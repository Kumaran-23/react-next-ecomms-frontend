"use client";
import React, { useEffect } from "react";
//import { themeChange } from "theme-change";
import Link from "next/link";
import { logOut } from "../../../utils/auth";
import { useSelector } from "react-redux";
import { isValidToken } from "../../../utils/auth";
import UploadFile from "./Upload";
import ParticleBackground from "./Particles";

function Navbar() {
  useEffect(() => {
    isValidToken();
  }, []);
 const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <div className="navbar sticky top-0 z-50 gradient_nav h-16">
      <ParticleBackground />
      <div className="flex-1">
        <Link href="/">
          <button className="btn rounded-full font-bold py-1 px-4 btn-accent hover:btn-acent-focus opacity-70 hover:opacity-100">
            Home
          </button>
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {isLoggedIn && (
        <div className="flex justify-end">
          <UploadFile />
        </div>
      )}
          {!isLoggedIn && (
            <Link href="/users/new">
              <button className="btn btn-hidden rounded-full font-bold py-1 px-4 mx-1 btn-accent hover:btn-acent-focus opacity-70 hover:opacity-100">
                Sign Up
              </button>
            </Link>
          )} 
           {/* <Link href="/users/new">
              <button className="btn-hidden rounded-full font-bold py-1 px-4 mx-1 btn-accent hover:btn-primary">
                Sign Up
              </button>
            </Link> */}
            {isLoggedIn ? (
            <Link href="/">
              <button
                onClick={logOut}
                className="btn rounded-full font-bold py-1 px-4 mx-1 btn-accent hover:btn-acent-focus opacity-70 hover:opacity-100"
              >
                Logout
              </button>
            </Link>
          ) : (
            <Link href="/login">
              <button className="btn rounded-full font-bold py-1 px-4 mx-1 btn-accent hover:btn-acent-focus opacity-70 hover:opacity-100">
                Login
              </button>
            </Link>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
