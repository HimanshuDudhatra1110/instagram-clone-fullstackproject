import { Firebase, FieldValue } from "../lib/firebase";

export async function doesUsernameExist(username) {
  const result = await Firebase.firestore()
    .collection("users")
    .where("username", "==", username.toLowerCase())
    .get();

  return result.docs.length > 0;
}

export async function getUserByUsername(username) {
  const result = await Firebase.firestore()
    .collection("users")
    .where("username", "==", username.toLowerCase())
    .get();

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
}

// get user from the firestore where userId === userId (passed from the auth)
export async function getUserByUserId(userId) {
  const result = await Firebase.firestore()
    .collection("users")
    .where("userId", "==", userId)
    .get();
  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return user;
}

export async function getSuggestedProfiles(userId, following) {
  let query = Firebase.firestore().collection("users");

  if (following.length > 0) {
    query = query.where("userId", "not-in", [...following, userId]);
  } else {
    query = query.where("userId", "!=", userId);
  }
  const result = await query.limit(10).get();

  const profiles = result.docs.map((user) => ({
    ...user.data(),
    docId: user.id,
  }));

  return profiles;
}

export async function updateLoggedInUserFollowing(
  loggedInUserDocId, // currently logged in user document id
  profileId, // the user that currently logged in user requests to follow
  isFollowingProfile // true/false (am i currently following this person?)
) {
  return Firebase.firestore()
    .collection("users")
    .doc(loggedInUserDocId)
    .update({
      following: isFollowingProfile
        ? FieldValue.arrayRemove(profileId)
        : FieldValue.arrayUnion(profileId),
    });
}

export async function updateFollowedUserFollowers(
  profileDocId, // currently logged in user document id
  loggedInUserDocId, // the user that currently logged in user requests to follow
  isFollowingProfile // true/false (am i currently following this person?)
) {
  return Firebase.firestore()
    .collection("users")
    .doc(profileDocId)
    .update({
      followers: isFollowingProfile
        ? FieldValue.arrayRemove(loggedInUserDocId)
        : FieldValue.arrayUnion(loggedInUserDocId),
    });
}

export async function getPhotos(userId, following) {
  // we have array of userid as following
  const result = await Firebase.firestore()
    .collection("photos")
    .where("userId", "in", following)
    .get();

  const userFollowedPhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      // lets say photo.userId = 2
      const user = await getUserByUserId(photo.userId);
      // raphael
      const { username } = user[0];
      return { username, ...photo, userLikedPhoto };
    })
  );
  // console.log("photos", photosWithUserDetails);
  return photosWithUserDetails;
}

export async function getUserPhotosByUserId(userId) {
  const result = await Firebase.firestore()
    .collection("photos")
    .where("userId", "==", userId)
    .get();

  const photos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));
  // console.log("docId", photos.docId);
  return photos;
}

export async function isUserFollowingProfile(
  loggedInUserUsername,
  profileUserId
) {
  const result = await Firebase.firestore()
    .collection("users")
    .where("username", "==", loggedInUserUsername) // zoro (active logged in user)
    .where("following", "array-contains", profileUserId)
    .get();

  const [response = {}] = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return response.userId;
}

export async function toggleFollow(
  isFollowingProfile,
  activeUserDocId,
  profileDocId,
  profileUserId,
  followingUserId
) {
  // 1st param: zoro's doc id
  // 2nd param: raphael's user id
  // 3rd param: is the user following this profile? e.g. does zoro follow raphael? (true/false)
  await updateLoggedInUserFollowing(
    activeUserDocId,
    profileUserId,
    isFollowingProfile
  );

  // 1st param: zoro's user id
  // 2nd param: raphael's doc id
  // 3rd param: is the user following this profile? e.g. does zoro follow raphael? (true/false)
  await updateFollowedUserFollowers(
    profileDocId,
    followingUserId,
    isFollowingProfile
  );
}

export async function avtarByUserId(userId) {
  const avtar = await Firebase.firestore()
    .collection("avtar")
    .where("userId", "==", userId)
    .get();

  const [response = {}] = avtar.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return response.avtarSrc;
}

export async function isUserHasAvtar(userId) {
  const result = await Firebase.firestore()
    .collection("avtar")
    .where("userId", "==", userId)
    .get();

  return result.docs.length > 0;
}

export async function followingByuserId(userId) {
  const result = await Firebase.firestore()
    .collection("users")
    .where("userId", "==", userId)
    .get();

  const response = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  const followingArray = response[0].following;

  return followingArray;
}
