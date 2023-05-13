import { useEffect, useState } from "react";
import Header from "../components/header";
import useUser from "../hooks/use-user";
import FollowingProfile from "../components/following";
import { followingByuserId } from "../services/firebase";

export default function Following() {
  const { user } = useUser();
  const [followingArray, setFollowingArray] = useState([]);

  useEffect(() => {
    async function getFollowing() {
      setFollowingArray(await followingByuserId(user.userId));
    }
    getFollowing();

    document.title = `${user.username}'s Following`;
  }, [user]);

  return (
    <div>
      <Header />
      <div className="mt-4 grid gap-5">
        {followingArray.map((profile) => (
          <FollowingProfile
            key={profile}
            profileId={profile}
            loggedInUserDocId={user.docId}
            activeUserId={user.userId}
          />
        ))}
      </div>
    </div>
  );
}
