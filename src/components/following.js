import { Link } from "react-router-dom";
import { DEFAULT_IMAGE_PATH } from "../constants/paths";
import { avtarByUserId, getUserByUserId } from "../services/firebase";

export default function FollowingProfile({ profileId }) {
  //   console.log("profileId", profileId);
  //   const [user] = getUserByUserId(profileId);
  //   console.log(getUserByUserId(profileId));
  const avtarURL = avtarByUserId(profileId);

  return null;
}
