import { useEffect, useState } from "react";
import useUser from "../hooks/use-user";
import { followersByuserId } from "../services/firebase";
import FollowersProfile from "../components/followers";
import Header from "../components/header";

export default function Followers() {
  const { user } = useUser();
  const [followersArray, setFollowersArray] = useState([]);

  useEffect(() => {
    async function getFollowers() {
      setFollowersArray(await followersByuserId(user.userId));
    }
    getFollowers();

    document.title = `${user.username}'s Followers`;
  }, [user]);

  return (
    <div>
      <Header />
      <div className="mt-4 grid gap-5">
        {followersArray.map((profile) => (
          <FollowersProfile
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
