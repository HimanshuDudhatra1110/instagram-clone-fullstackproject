import { useContext, useEffect, useState } from "react";
import useUser from "../hooks/use-user";
import FirebaseContext from "../context/firebase";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { isUserHasAvtar } from "../services/firebase";

export default function AddAvtar() {
  const { user } = useUser();
  const [avtarImage, setAvtarImage] = useState("");
  const { Firebase } = useContext(FirebaseContext);
  const navigate = useNavigate();
  const [preview, setPreview] = useState("");

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

    console.log("avtarImage", avtarImageURL);
    const avtarExists = await isUserHasAvtar(user.userId);

    if (avtarExists) {
      const query = await Firebase.firestore()
        .collection("avtar")
        .where("userId", "==", user.userId)
        .get();

      if (!query.empty) {
        const docRef = query.docs[0].ref;
        await docRef.update({
          avtarSrc: avtarImageURL,
        });
      }
    } else {
      await Firebase.firestore().collection("avtar").add({
        avtarSrc: avtarImageURL,
        userId: user.userId,
        username: user.username.toLowerCase(),
      });
    }

    navigate(`/p/${user.username}`);
  };

  useEffect(() => {
    document.title = "Update Profile Picture";
  }, []);

  return (
    <div>
      <Header />

      <div className="bg-gray-background pt-0">
        <div className="container flex flex-col justify-center mx-auto max-w-screen-md items-center h-screen">
          <div className=" bg-white p-4 border border-gray-primary mb-4 rounded max-w-screen-sm">
            <form onSubmit={handleAvtar} method="POST">
              <div className="flex gap-2 pb-4">
                <label htmlFor="imageSelect">Select Image: </label>
                <input
                  type="file"
                  id="imageSelect"
                  onChange={(e) => {
                    setAvtarImage(e.target.files[0]);
                    setPreview(URL.createObjectURL(e.target.files[0])); // Set preview URL
                  }}
                />
              </div>
              {preview && (
                <div className="pb-4 flex justify-center">
                  <img
                    className="rounded-full h-40 w-40"
                    src={preview}
                    alt="Selected avtar"
                    style={{ maxWidth: "100%" }}
                  />
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={btnInvalid}
                  className={`bg-blue-medium font-bold text-sm rounded text-white w-40 h-8 mt-4
            ${btnInvalid && "opacity-50"}`}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container flex flex-col justify-center mx-auto max-w-screen-md items-center h-screen">
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
