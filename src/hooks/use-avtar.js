import { useEffect, useState } from "react";
import { DEFAULT_IMAGE_PATH } from "../constants/paths";
import { avtarByUserId } from "../services/firebase";

export default function useAvtar(userId) {
  //   console.log("userId", userId);
  const [avtarURL, setAvtarURL] = useState(DEFAULT_IMAGE_PATH);

  useEffect(() => {
    if (userId) {
      const getAvtarURL = async () => {
        const url = await avtarByUserId(userId);
        setAvtarURL(url);
      };
      getAvtarURL();
    }
  }, [userId]);

  if (avtarURL === undefined) {
    setAvtarURL(DEFAULT_IMAGE_PATH);
  }

  //   console.log("url", avtarURL);

  return avtarURL;
}
