import { useContext, useState } from "react";
import useUser from "../hooks/use-user";
import FirebaseContext from "../context/firebase";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";

export default function CreatePost() {
  const { user } = useUser();
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const { Firebase } = useContext(FirebaseContext);
  const navigate = useNavigate();

  let imageURL;

  const btnInvalid = image === "";

  const handlePost = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "instagramclone");
    data.append("cloud_name", "dbbrtvjoo");

    await fetch("https://api.cloudinary.com/v1_1/dbbrtvjoo/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        imageURL = data.url;
      })
      .catch((err) => {
        console.log(err);
      });

    await Firebase.firestore().collection("photos").add({
      caption: caption,
      comments: [],
      dateCreated: Date.now(),
      imageSrc: imageURL,
      likes: [],
      photoId: Date.now(),
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
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="flex flex-row">
          <label for="caption">Add Caption</label>
          <input
            className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
            type="text"
            id="caption"
            name="caption"
            onChange={(e) => {
              setCaption(e.target.value);
            }}
          />
        </div>
        <div>
          <button
            onClick={handlePost}
            disabled={btnInvalid}
            className={`bg-blue-medium font-bold text-sm rounded text-white w-40 h-8 mt-4
            ${btnInvalid && "opacity-50"}`}
          >
            Submit{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
