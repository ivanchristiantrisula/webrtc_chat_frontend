import { AES, enc } from "crypto-js";

const encKey = process.env.REACT_APP_KEY;

function setUserInfo(raw: {}) {
  let stringified = JSON.stringify(raw);

  const encrypted = AES.encrypt(stringified, encKey).toString();

  localStorage.setItem("user", encrypted);
}

function getUserInfo() {
  const encUser = localStorage.getItem("user");

  if (!encUser) throw Error("No user info. User not logged in yet!");

  try {
    const decryptedUser = JSON.parse(
      AES.decrypt(encUser, encKey).toString(enc.Utf8)
    );
    return decryptedUser;
  } catch (error) {
    throw Error("Failed decrypting user info");
  }
}

function setUserChatHistory(chats: any) {
  try {
    let userID = getUserInfo().id;
    console.log(userID);
    let usersChats = {};
    if (localStorage.getItem("chats")) {
      usersChats = JSON.parse(
        AES.decrypt(
          localStorage.getItem("chats"),
          process.env.REACT_APP_KEY
        ).toString(enc.Utf8)
      );
    } else {
      usersChats = {};
    }
    usersChats[userID] = chats;
    let encryptedChats = AES.encrypt(
      JSON.stringify(usersChats),
      encKey
    ).toString();
    localStorage.setItem("chats", encryptedChats);
  } catch (error) {
    console.error("Failed saving chat. Error : " + error);
  }
}

function getUserChatHistory() {
  try {
    let userID = getUserInfo().id;
    let chats;
    if (localStorage.getItem("chats")) {
      chats =
        JSON.parse(
          AES.decrypt(
            localStorage.getItem("chats"),
            process.env.REACT_APP_KEY
          ).toString(enc.Utf8)
        )[userID] || {};
    } else {
      chats = {};
    }

    console.info("Chat history successfully loaded!");
    return chats;
  } catch (error) {
    console.error("Failed loading chat from DB. Error : " + error);
  }
}

function setToken(rawString: string) {
  localStorage.setItem("token", AES.encrypt(rawString, encKey).toString());
}

function getToken() {
  const encToken = localStorage.getItem("token");
  const decToken = AES.decrypt(encToken, encKey).toString(enc.Utf8);

  return decToken;
}

export {
  setUserInfo,
  getUserInfo,
  setUserChatHistory,
  getUserChatHistory,
  setToken,
  getToken,
};
