import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { DEFAULT_IMAGE_PATH } from "../../constants/paths";
import useAvtar from "../../hooks/use-avtar";

export default function Header({ username, userId }) {
  const avtarURL = useAvtar(userId);
  return (
    <div className="flex border-b border-gray-primary h-4 p-4 py-8">
      <div className="flex items-center">
        <Link to={`/p/${username}`} className="flex items-center">
          <img
            className="rounded-full h-8 w-8 flex mr-3"
            src={avtarURL}
            alt={`${username} profile avtar`}
            onError={(e) => {
              e.target.src = DEFAULT_IMAGE_PATH;
            }}
          />
          <p className="font-bold">{username}</p>
        </Link>
      </div>
    </div>
  );
}

Header.propTypes = {
  username: PropTypes.string.isRequired,
};
