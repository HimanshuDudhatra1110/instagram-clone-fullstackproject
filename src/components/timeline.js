import { useContext } from "react";
import LoggedInUserContext from "../context/logged-in-user";
import usePhotos from "../hooks/use-photos";
import Skeleton from "react-loading-skeleton";
import Post from "./post/post";

export default function Timeline() {
  const { user } = useContext(LoggedInUserContext);
  const { photos } = usePhotos(user);

  return (
    <div className="col-span-2">
      {user.following === undefined ? (
        <Skeleton count={2} width={640} height={500} className="mb-5" />
      ) : user.following.length === 0 ? (
        <p className="flex justify-center font-bold">
          Follow other people to see Photos
        </p>
      ) : photos ? (
        photos.map((content) => <Post key={content.docId} content={content} />)
      ) : null}
    </div>
  );
}
