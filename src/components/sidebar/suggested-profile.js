import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import { DEFAULT_IMAGE_PATH } from "../../constants/paths";
import {
  updateFollowedUserFollowers,
  updateLoggedInUserFollowing,
} from "../../services/firebase";
import useAvtar from "../../hooks/use-avtar";

export default function SuggestedProfile({
  profileDocId,
  username,
  profileId,
  userId,
  loggedInUserDocId,
}) {
  const [followed, setFollowed] = useState(false);
  const avtarURL = useAvtar(profileId);

  async function handleFollowUser() {
    setFollowed(true);
    await updateLoggedInUserFollowing(loggedInUserDocId, profileId, false);
    await updateFollowedUserFollowers(profileDocId, userId, false);
    // const [user] = await getUserByUserId(userId);
  }

  return !followed ? (
    <div className="flex flex-row items-center align-items justify-between">
      <div className="flex items-center justify-between">
        <img
          className="rounded-full w-8 h-8 flex mr-3"
          src={avtarURL}
          alt="user's profile avtar"
          onError={(e) => {
            e.target.src = DEFAULT_IMAGE_PATH;
          }}
        />
        <Link to={`/p/${username}`}>
          <p className="font-bold text-sm">{username}</p>
        </Link>
      </div>
      <button
        className="text-xs font-bold text-blue-medium"
        type="button"
        onClick={handleFollowUser}
      >
        Follow
      </button>
    </div>
  ) : null;
}

SuggestedProfile.propTypes = {
  profileDocId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  profileId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  loggedInUserDocId: PropTypes.string.isRequired,
};
