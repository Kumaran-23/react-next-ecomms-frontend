"use client";

import { authenticateUser } from "../../../../utils/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { setAlert, clearAlert } from "../../../../store/alerts/alertSlice";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

const SignUp = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formErrors, setFormErrors] = useState({});
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, []);

  async function createUser(evt) {
    evt.preventDefault();

    if (
      evt.target["password"].value !== evt.target["password-confirmation"].value
    ) {
      setFormErrors({ password: "Password confirmation does not match" });
      return;
    }

    const userData = {
      name: evt.target["name"].value,
      email: evt.target["email"].value,
      password: evt.target["password"].value,
    };

    try {
      const resp = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/users",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (resp.status == 200) {
       const res = await authenticateUser(
          userData.email,
          userData.password
        );

        if (res.success) {
           dispatch(
          setAlert({
            message: "Sign Up Successful!",
            type: "alert-success",
          })
        );
        setTimeout(() => {
          dispatch(clearAlert());
        }, 3000);
        router.push('/')
        } else {
          throw "Sign up succeeded but authentication failed";
        }
      } else {
        const res = await resp.json();
        setFormErrors(res.error);
        dispatch(
          setAlert({
            message: "Sign Up Unsuccesful, Please Try Again.",
            type: "alert-error",
          })
        );
        setTimeout(() => {
          dispatch(clearAlert());
        }, 3000);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  return (
    <div className="mt-0">
      <h1 className="text-center text-xl mt-5 text-slate-300 text-glow">
        Create an Account to Upload an Image
      </h1>
      <div className="text-center">
        <Link className="link-hover italic text-xs text-slate-300 text-glow" href="/login">
          Already have an account? Click here to login instead.
        </Link>
      </div>
      <div className="flex justify-center items-center mt-8">
        <form onSubmit={createUser} className="w-3/4 sm:w-1/3">
          <div className="form-control w-full">
            <label className="label" htmlFor="name">
              <span className="label-text text-slate-300 text-glow">Name</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="johndoe"
              className="input input-bordered w-full"
            />
            {formErrors["name"] && (
              <label className="label" htmlFor="name">
                <span className="label-text-alt text-red-500">
                  {formErrors["name"]}
                </span>
              </label>
            )}
          </div>

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
              <span className="label-text text-slate-300 text-glow">Password</span>
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

          <div className="form-control w-full">
            <label className="label" htmlFor="password">
              <span className="label-text text-slate-300 text-glow">Confirm Password</span>
            </label>
            <input
              type="password"
              name="password-confirmation"
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

          <div className="form-control w-full mt-4 mb-4">
            <button className="btn btn-md btn-accent hover:btn-acent-focus opacity-70 hover:opacity-100">
              Create an Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
