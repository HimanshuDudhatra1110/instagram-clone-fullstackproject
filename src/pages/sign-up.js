import { Link, Routes, useNavigate } from "react-router-dom";
import FirebaseContext from "../context/firebase";
import { useContext, useEffect, useState } from "react";
import * as ROUTES from "../constants/routes";
import { doesUsernameExist } from "../services/firebase";

function Signup() {
  const navigate = useNavigate();
  const { Firebase } = useContext(FirebaseContext);

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const isInvalid = password === "" || emailAddress === "";

  const handleSignUp = async (event) => {
    event.preventDefault();

    const usernameExists = await doesUsernameExist(username);

    // console.log("usernameExits", usernameExists);

    if (!usernameExists) {
      try {
        const createdUserResult =
          await Firebase.auth().createUserWithEmailAndPassword(
            emailAddress,
            password
          );

        // authentication
        // -> emailAddress & password & username (displayName)

        await createdUserResult.user.updateProfile({
          displayName: username,
        });

        // firebase user collection (create a document for new user who signups)

        await Firebase.firestore().collection("users").add({
          userId: createdUserResult.user.uid,
          username: username.toLowerCase(),
          fullName,
          emailAddress: emailAddress.toLowerCase(),
          following: [],
          followers: [],
          dateCreated: Date.now(),
        });

        navigate(ROUTES.DASHBOARD);
      } catch (error) {
        setFullName("");
        setEmailAddress("");
        setPassword("");
        setError(error.message);
      }
    } else {
      setUsername("");
      setError(username + " username is already taken, please try another.");
    }
  };
  useEffect(() => {
    document.title = "Sign Up into Instagram";
  }, []);

  return (
    <div
      className="bg-cover bg-center "
      style={{ backgroundImage: "url('/images/instagram_bg.jpeg')" }}
    >
      <div className="text-center font-bold text-white pt-10 max-w-screen-lg mx-auto">
        <h3>
          "Welcome to PostStorm, where you can join our community of content
          creators and unleash your creativity! Discover a world of endless
          inspiration and share your story with the world. We're thrilled to
          have you on board and can't wait to see what amazing content you'll
          share with our community."
        </h3>
      </div>
      <div className="container flex mx-auto max-w-screen-md items-center h-screen">
        <div className="flex w-3/5">
          <img
            className="rotate-[15deg] w-4/5"
            src="/images/iphone-with-profile.png"
            alt="instagram in iphone image"
          ></img>
        </div>

        <div className="flex flex-col w-2/5">
          <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
            <h1 className="flex justify-center w-full">
              <img
                src="/images/logo.png"
                alt="Instagram"
                className="mt-2 w-6/12 mb-4"
              ></img>
            </h1>

            {error && <p className="mb-4 text-xs text-red-primary">{error}</p>}

            <form onSubmit={handleSignUp} method="POST">
              <input
                aria-label="Enter your username"
                type="text"
                placeholder="Username"
                className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                onChange={({ target }) => setUsername(target.value)}
                value={username}
              />
              <input
                aria-label="Enter your full name"
                type="text"
                placeholder="Full name"
                className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                onChange={({ target }) => setFullName(target.value)}
                value={fullName}
              />
              <input
                aria-label="Enter your email address"
                type="email"
                placeholder="Email address"
                className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                onChange={({ target }) => setEmailAddress(target.value)}
                value={emailAddress}
              />
              <input
                aria-label="Enter your password"
                type="password"
                placeholder="Password"
                className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                onChange={({ target }) => setPassword(target.value)}
                value={password}
              />
              <button
                disabled={isInvalid}
                type="submit"
                className={`bg-blue-medium text-white w-full rounded h-8 font-bold
            ${isInvalid && "opacity-50"}`}
              >
                Sign Up
              </button>
            </form>
          </div>

          <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary">
            <p className="text-sm">Already have an account?{` `}</p>
            <Link to={ROUTES.LOGIN} className="font-bold text-blue-medium">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
