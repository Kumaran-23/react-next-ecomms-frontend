import { login, logout } from "../store/slices/loginSlice";
import store from "../store/store";

const emptyAuth = {
  token: "",
  userId: "",
};

export function logOut() {
  localStorage.setItem("auth", JSON.stringify(emptyAuth));
  store.dispatch(logout());
  return true;
}

export function getUserId() {
  const auth = localStorage.getItem("auth");
  if (auth) {
    return JSON.parse(auth)["userId"];
  }
  return null;
}

export function getTokenFromLocalStorage() {
  const auth = localStorage.getItem("auth");
  if (auth) {
    return JSON.parse(auth)["token"];
  }
  return null;
}

export async function isValidToken() {
  if (!getTokenFromLocalStorage()) {
    return false;
  }
  else
    store.dispatch(login());

}

export async function authenticateUser(email, password) {
  const resp = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/auth",
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const res = await resp.json();
  console.log(res)

  if (resp.status == 200) {
    localStorage.setItem(
      "auth",
      JSON.stringify({
        token: res.accessToken,
        userId: res.userId,
      })
    );
    store.dispatch(login());
    return {
      success: true,
      res: res,
    };
  }

  return {
    success: false,
    res: res,
  };
}