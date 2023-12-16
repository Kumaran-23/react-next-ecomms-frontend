"use client";
import Script from "next/script";
import {
  generateUniqueFileName,
  uploadMedia,
} from "../../../utils/s3-uploader";
import { getTokenFromLocalStorage } from "../../../utils/auth";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setAlert, clearAlert } from "../../../store/alerts/alertSlice";

function formattedPrice(price) {
  const isNumber = /^\d+(\.\d{1,2})?$/;
  return isNumber.test(price);
}

function validatedForm(target) {
  let localFormErrors = {};

  const title = target["title"].value;
  const discription = target["discription"].value;
  const price = target["price"].value;
  const url = target["file"].files;

  if (price.length == 0) {
    localFormErrors["price"] = "cannot be blank";
  }

  if (title.length == 0) {
    localFormErrors["title"] = "cannot be blank";
  }

  if (discription.length == 0) {
    localFormErrors["discription"] = "cannot be blank";
  }

  if (!formattedPrice(price)) {
    localFormErrors["price"] = "must be number with at most 2 decimals";
  }

  if (typeof url === "undefined" || url.length === 0) {
    localFormErrors["file"] = "no file uploaded";
  } else if (!url[0].type || !url[0].type.match(/image\/(jpg|jpeg|png|gif|webp)/)) {
    localFormErrors["file"] = "must be an image";
  }

  return localFormErrors;
}

const UploadFile = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formErrors, setFormErrors] = useState({});

  const formRef = useRef(null);
  const modalCheckboxRef = useRef(null);

  async function uploadImage(evt) {
    evt.preventDefault();

    const errors = validatedForm(evt.target);
    // setFormErrors(errors);

    if (Object.keys(errors).length !== 0) {
      setFormErrors(errors);
      return;
    }

    const renamedImage = generateUniqueFileName(evt.target["file"].files[0]);

    const [fileName, fileUrl] = await uploadMedia(renamedImage);

    const token = getTokenFromLocalStorage();

    const imageData = {
      title: evt.target["title"].value,
      discription: evt.target["discription"].value,
      price: parseInt(evt.target["price"].value),
      url: fileUrl,
    };

    console.log(imageData);
    console.log(token);

    const resp = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/image",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(imageData),
      }
    );

    if (resp.status == 200) {
      dispatch(
        setAlert({
          message: "Upload Successful!",
          type: "alert-success",
        })
      );
       formRef.current.reset();
      modalCheckboxRef.current.checked = false;
      setTimeout(() => {
        dispatch(clearAlert());
      }, 2000);
      setTimeout(() => {
         location.reload();
      }, 3000)
    } else {
      const res = await resp.json();
      console.log(res.errors);
      setFormErrors(res.errors);
      dispatch(
        setAlert({
          message: res.errors,
          type: "alert-error",
        })
      );
      setTimeout(() => {
        dispatch(clearAlert());
      }, 3000);
    }
  }

  return (
    <>
      <Script
        src="/static/aws-sdk-s3.min.js"
        onLoad={() => {
          console.log("Script has loaded");
        }}
      />
      <label
        htmlFor="my-modal-4"
        className="btn btn-md btn-accent hover:btn-acent-focus opacity-70 hover:opacity-100"
      >
        <svg
          className="h-8 w-8 text-black"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path stroke="none" d="M0 0h24v24H0z" />{" "}
          <line x1="12" y1="5" x2="12" y2="19" />{" "}
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>{" "}
        Upload Image
      </label>
      <input type="checkbox" id="my-modal-4" className="modal-toggle" ref={modalCheckboxRef} />
      <label  htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" style={{ width: '1200px', padding: '50px' }} >
          <form onSubmit={uploadImage} className="w-full " ref={formRef}>
            <div className="form-control w-full mt-2">
              <input type="file" name="file" />
              {formErrors["file"] && (
                <label className="label" htmlFor="file">
                  <span className="label-text-alt text-red-500">
                    {formErrors["file"]}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label" htmlFor="title">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="Hi my name is, what my name is"
                className="input input-bordered w-full"
                required
              />
              {formErrors["title"] && (
                <label className="label" htmlFor="title">
                  <span className="label-text-alt text-red-500">
                    {formErrors["title"]}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label" htmlFor="price">
                <span className="label-text">Price</span>
              </label>
              <input
                type="text"
                name="price"
                placeholder="420.69"
                className="input input-bordered w-full"
                required
              />
              {formErrors["price"] && (
                <label className="label" htmlFor="price">
                  <span className="label-text-alt text-red-500">
                    {formErrors["price"]}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label" htmlFor="description">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="discription"
                className="textarea textarea-bordered w-full"
                placeholder="Just Chillin, Illin, You know..."
              />
              {formErrors["discription"] && (
                <label className="label" htmlFor="discription">
                  <span className="label-text-alt text-red-500">
                    {formErrors["discription"]}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control w-full mt-4">
              <button className="btn btn-md btn-accent hover:btn-acent-focus opacity-70 hover:opacity-100">
                Upload Image
              </button>
            </div>
          </form>
        </label>
      </label>
    </>
  );
};

export default UploadFile;
