import { useEffect, useState } from "react";
import {
  getUserByUserId,
  updateLoggedInUserFollowers,
  updateRemovedUsersFollowing,
} from "../services/firebase";
import useAvtar from "../hooks/use-avtar";
import { DEFAULT_IMAGE_PATH } from "../constants/paths";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function FollowersProfile({
  profileId,
  loggedInUserDocId,
  activeUserId,
}) {
  const [followerUser, setFollowerUser] = useState();
  const avtarURL = useAvtar(profileId);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    async function getFollowerUserObj() {
      const [response] = await getUserByUserId(profileId);
      setFollowerUser(response);
    }
    getFollowerUserObj();
  }, [profileId]);

  async function handleRemoveUser() {
    setRemoved(true);

    await updateLoggedInUserFollowers(loggedInUserDocId, profileId, true);
    await updateRemovedUsersFollowing(followerUser.docId, activeUserId, true);
  }

  return (
    <>
      {!removed ? (
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
            {followerUser && (
              <Link to={`/p/${followerUser.username}`}>
                <p className="font-bold text-sm">{followerUser.username}</p>
              </Link>
            )}
          </div>
          <button
            className="text-xs font-bold text-blue-medium"
            type="button"
            onClick={handleRemoveUser}
          >
            Remove
          </button>
        </div>
      ) : null}
    </>
  );
}

FollowersProfile.propTypes = {
  profileId: PropTypes.string.isRequired,
  loggedInUserDocId: PropTypes.string.isRequired,
  activeUserId: PropTypes.string.isRequired,
};
