import { useContext, useState } from "react";
import useUser from "../hooks/use-user";
import FirebaseContext from "../context/firebase";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";

export default function CreatePost() {
  const { user } = useUser();
  const [avtarImage, setAvtarImage] = useState("");
  const { Firebase } = useContext(FirebaseContext);
  const navigate = useNavigate();

  let avtarImageURL;

  const btnInvalid = avtarImage === "";

  const handleAvtar = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("file", avtarImage);
    data.append("upload_preset", "instagramclone");
    data.append("cloud_name", "dbbrtvjoo");

    await fetch("https://api.cloudinary.com/v1_1/dbbrtvjoo/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        avtarImageURL = data.url;
      })
      .catch((err) => {
        console.log(err);
      });

    await Firebase.firestore().collection("avtar").add({
      avtarSrc: avtarImageURL,
      userId: user.userId,
    });

    navigate(`/p/${user.username}`);
  };

  return (
    <div>
      <Header />
      <div className="container flex flex-col justify-center mx-auto max-w-screen-md items-center h-screen bg-white p-4 border border-gray-primary mb-4 rounded">
        <div>
          <label for="imageSelect">Image</label>
          <input
            type="file"
            id="imageSelect"
            onChange={(e) => setAvtarImage(e.target.files[0])}
          />
        </div>
        <div>
          <button
            onClick={handleAvtar}
            disabled={btnInvalid}
            className={`bg-blue-medium font-bold text-sm rounded text-white w-40 h-8 mt-4
            ${btnInvalid && "opacity-50"}`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
