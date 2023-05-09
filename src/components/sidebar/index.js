import Suggestions from "./suggestions";
import User from "./user";
import { useContext } from "react";
import LoggedInUserContext from "../../context/logged-in-user";

export default function Sidebar() {
  const { user: { docId = "", fullName, username, userId, following } = {} } =
    useContext(LoggedInUserContext);
  return (
    <div className="p-4">
      <User username={username} fullName={fullName} userId={userId} />
      <Suggestions
        userId={userId}
        following={following}
        loggedInUserDocId={docId}
      />
    </div>
  );
}
