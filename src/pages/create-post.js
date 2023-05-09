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
  const [preview, setPreview] = useState("");

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
      <div className="bg-gray-background pt-0">
        <div className="container flex flex-col justify-center mx-auto max-w-screen-md items-center h-screen">
          <div className=" bg-white p-4 border border-gray-primary mb-4 rounded max-w-screen-sm">
            <form onSubmit={handlePost} method="POST">
              <div className="flex gap-2 pb-4">
                <label for="imageSelect">Select Image:</label>
                <input
                  type="file"
                  id="imageSelect"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    setPreview(URL.createObjectURL(e.target.files[0])); // Set preview URL
                  }}
                />
              </div>
              {preview && (
                <div className="pb-4">
                  <img
                    src={preview}
                    alt="Selected Image"
                    style={{ maxWidth: "100%" }}
                  />
                </div>
              )}
              <div className="flex gap-11">
                <label for="caption">Caption:</label>
                <textarea
                  className="text-sm text-gray-base w-full mr-3 py-5 px-4 border border-gray-primary rounded mb-2"
                  id="caption"
                  name="caption"
                  style={{ height: "4rem" }} // Set initial height
                  onChange={(e) => {
                    setCaption(e.target.value);
                    e.target.style.height = "auto"; // Reset height
                    e.target.style.height = e.target.scrollHeight + "px"; // Set new height
                  }}
                />
              </div>
              <div className="flex justify-center">
                <button
                  disabled={btnInvalid}
                  type="submit"
                  className={`bg-blue-medium font-bold text-sm rounded text-white w-40 h-8 mt-4
            ${btnInvalid && "opacity-50"}`}
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
