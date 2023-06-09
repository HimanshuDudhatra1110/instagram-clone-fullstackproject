import { Link } from "react-router-dom";
import { DEFAULT_IMAGE_PATH } from "../constants/paths";
import {
  getUserByUserId,
  updateFollowedUserFollowers,
  updateLoggedInUserFollowing,
} from "../services/firebase";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useAvtar from "../hooks/use-avtar";

export default function FollowingProfile({
  profileId,
  loggedInUserDocId,
  activeUserId,
}) {
  const [followingUser, setFollowingUser] = useState();
  const [followed, setFollowed] = useState(true);
  const avtarURL = useAvtar(profileId);

  useEffect(() => {
    async function getFollowingUser() {
      const [response] = await getUserByUserId(profileId);
      setFollowingUser(response);
    }
    getFollowingUser();
  }, [profileId]);

  async function handleUnfollowUser() {
    setFollowed(false);

    await updateLoggedInUserFollowing(loggedInUserDocId, profileId, true);
    await updateFollowedUserFollowers(followingUser.docId, activeUserId, true);
  }

  return (
    <>
      {followed ? (
        <div className="container max-w-screen-sm mx-auto flex flex-row items-center align-items justify-between px-[10%]">
          <div className="flex items-center justify-between ">
            <img
              className="rounded-full w-8 h-8 flex mr-3"
              src={avtarURL}
              alt="user's profile avtar"
              onError={(e) => {
                e.target.src = DEFAULT_IMAGE_PATH;
              }}
            />
            {followingUser && (
              <Link to={`/p/${followingUser.username}`}>
                <p className="font-bold text-sm">{followingUser.username}</p>
              </Link>
            )}
          </div>
          <button
            className="text-xs font-bold text-blue-medium"
            type="button"
            onClick={handleUnfollowUser}
          >
            Unollow
          </button>
        </div>
      ) : null}
    </>
  );
}

FollowingProfile.propTypes = {
  profileId: PropTypes.string.isRequired,
  loggedInUserDocId: PropTypes.string.isRequired,
  activeUserId: PropTypes.string.isRequired,
};
