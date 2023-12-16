"use client";

import { authenticateUser } from "../../../utils/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { setAlert, clearAlert } from "../../../store/alerts/alertSlice";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

const SignIn = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formErrors, setFormErrors] = useState({});
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, []);

  async function logIn(evt) {
    evt.preventDefault();

    const userData = {
      email: evt.target["email"].value,
      password: evt.target["password"].value,
    };

    const res = await authenticateUser(userData.email, userData.password);

    if (res.success) {
      dispatch(
        setAlert({
          message: "Login Successful!",
          type: "alert-success",
        })
      );
      setTimeout(() => {
        dispatch(clearAlert());
      }, 3000);
      router.push("/");
    } else {
      setFormErrors(res.res.error);
      dispatch(
        setAlert({
          message: formErrors["login"],
          type: "alert-error",
        })
      );
      setTimeout(() => {
        dispatch(clearAlert());
      }, 3000);
    }
  }

return (
  <div>
    <h1 className="text-center text-xl mt-5 text-slate-300 text-glow">
      Sign In
    </h1>
    <div className="text-center">
      <Link
        className="link-hover italic text-xs text-slate-300 text-glow"
        href="/users/new"
      >
        Don't have an account? Click here to create an account instead.
      </Link>
    </div>
    <div className="flex justify-center items-center mt-8">
      <form onSubmit={logIn} className="w-3/4 sm:w-1/3">
        <div className="form-control w-full">
          <label className="label" htmlFor="email">
            <span className="label-text text-slate-300 text-glow">Email</span>
          </label>
          <input
            type="text"
            name="email"
            placeholder="john@example.com"
            className="input input-bordered w-full"
          />
          {formErrors["email"] && (
            <label className="label" htmlFor="email">
              <span className="label-text-alt text-red-500">
                {formErrors["email"]}
              </span>
            </label>
          )}
        </div>

        <div className="form-control w-full">
          <label className="label" htmlFor="password">
            <span className="label-text text-slate-300 text-glow">
              Password
            </span>
          </label>
          <input
            type="password"
            name="password"
            placeholder=""
            className="input input-bordered w-full"
            required
          />
          {formErrors["password"] && (
            <label className="label" htmlFor="password">
              <span className="label-text-alt text-red-500">
                {formErrors["password"]}
              </span>
            </label>
          )}
        </div>
        <div className="form-control w-full mt-4">
          <button className="btn btn-md btn-accent hover:btn-acent-focus opacity-70 hover:opacity-100">
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

export default SignIn;
