"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserId, getTokenFromLocalStorage } from "../../utils/auth";

export default function Home() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [data, setData] = useState({ images: [] });

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalImageURL, setModalImageURL] = useState('');

  function openModalWithImage(imageURL) {
    setModalImageURL(imageURL);
    setModalOpen(true);
  }

  async function getImage() {
    try {
      const resp = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/image"
      );
      if (resp.status === 200) {
        const res = await resp.json();
        return { images: res };
      } else {
        return { images: [] };
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return { images: [] };
    }
  }

  async function checkout(id) {
    const resp = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/checkout",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      }
    );

    const res = await resp.json();
    console.log(res);

    window.location.href = res; //`res` contains the URL. window.location.href redirects using Next.js
  }

  async function deleteImage(id) {
    const token = getTokenFromLocalStorage();
    const imageId = parseInt(id);

    const resp = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + `/image/${imageId}`,
      {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      }
    );

    if (resp.status === 200) {
      location.reload();
    }
  }

  useEffect(() => {
    async function fetchData() {
      const result = await getImage();
      console.log(result);
      setData(result);
    }
    fetchData();
  }, []);

  return (
    <div className=" min-h-screen">
      <div className="flex justify-center items-center h-1/2 mx-auto">
        <h1 className="text-center text-4xl text-glow mb-2 pt-0 font-bold font-mono border border-primary bg-primary rounded-lg py-2 px-4 inline-block">
      DOODLES NTF MARKET PLACE
    </h1>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal modal-open">
            <div className="modal-box">
              <img src={modalImageURL} alt="Full Size Image" className="max-w-full h-auto" />
              <div className="text-right">
                <button 
                  onClick={() => setModalOpen(false)}
                  className="btn w-[80px] btn-accent hover:btn-acent-focus opacity-70 hover:opacity-100 mt-5"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 mx-auto pt-10 pb-10 w-[1200px]">
        {data.images.map((image) => (
          <div className="card hover:transition delay-150 hover:-translate-y-10 shadow-3xl shadow-white hover:shadow-gray-700 flex flex-col justify-between">
            <figure className="relative h-[300px]">
              <img
                src={image.url}
                alt=""
                className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
              />
            </figure>
            <div className="card-body flex-grow bg-gradient-to-r from-green-400 to-teal-400 rounded-b-2xl">
              <h2 className="card-title text-lg font-bold mb-2">
                {image.title}
              </h2>
              <p className="mb-4">{image.discription}</p>
              <p className="">${image.price / 100} USD</p>
              <div className="card-actions justify-center mt-4">
                <button class="btn w-[80px] btn-accent hover:btn-secondary opacity-60 hover:opacity-100" onClick={() => openModalWithImage(image.url)}>
                  View
                </button>
                {!(image.userId == getUserId()) && (
                  <button
                    class="btn w-[80px] btn-accent hover:btn-secondary opacity-60 hover:opacity-100"
                    onClick={() => checkout(image.id)}
                  >
                    Buy
                  </button>
                )}
                {image.userId == getUserId() && (
                  <button
                    class="btn w-[80px] btn-accent hover:btn-secondary opacity-60 hover:opacity-100"
                    onClick={() => deleteImage(image.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
