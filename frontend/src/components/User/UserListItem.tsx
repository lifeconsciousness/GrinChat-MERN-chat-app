import { Avatar } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { getSender } from "../config/ChatLogic";

type Props = {
  user: any;
  handleFunction: any;
  chatListWidth: number | undefined;
  isSearching: boolean;
};

const UserListItem = ({
  user,
  handleFunction,
  chatListWidth,
  isSearching,
}: Props) => {
  const { selectedChat, setSelectedChat } = ChatState();
  const userInfo = localStorage.getItem("userInfo");
  const [loggedUser, setLoggedUser] = useState(userInfo ? JSON.parse(userInfo) : null);

  const [sidebarWidth, setsidebarWidth] = useState<Number>();
  const [nameWidth, setNameWidth] = useState<Number>();
  const sidebarCutoff = screen.width <= 520 ? 500 : 145;
  const nameCutoff = -170;

  useEffect(() => {
    const savedWidth =
      Number(localStorage.getItem("chatListWidth")) - sidebarCutoff;

    setsidebarWidth(savedWidth);
    setNameWidth(savedWidth - nameCutoff - sidebarCutoff);

    // console.log(loggedUser)
  }, []);

  useEffect(() => {
    if (chatListWidth) {
      setsidebarWidth((chatListWidth -= sidebarCutoff));
      setNameWidth((chatListWidth -= nameCutoff + sidebarCutoff));
    }
  }, [chatListWidth]);

  return (
    <div onClick={handleFunction} className="personal-chat-in-list">
      <div className="user-pic-name" style={{ width: "100%" }}>
        <Avatar
          size="md"
          name={user?.name}
          src={isSearching ? (loggedUser?._id == user?.users[0]?._id ? user?.users[1]?.picture : user?.users[0]?.picture) : user?.picture}
          // src={loggedUser?._id == user?.users[0]?._id ? user?.users[1]?.picture : user?.users[0]?.picture}
          className="avatar"
          userSelect="none"
        />
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: screen.width <= 520 ? screen.width - 70 : "unset",
            }}
          >
            <p
              style={{
                maxWidth: `${
                  screen.width <= 520 ? screen.width - 170 : nameWidth
                }px`,
              }}
              className="username-in-chatlist"
            >
              {!user?.isGroupChat
                ? getSender(loggedUser, user, isSearching)
                : user?.chatName}
            </p>
            <p style={{ opacity: 0, fontSize: "70%" }}>13:20</p>
            <p
              style={{
                opacity: 0.3,
                fontSize: "70%",
                position: "absolute",
                right: "8px",
              }}
            >
              {user?.latestMessage?.updatedAt.slice(11, 16)}
            </p>
          </div>

          {/* Display sender name if it's a group chat */}
          <div style={{ display: "flex", fontSize: "90%" }}>
            {user?.isGroupChat && user?.latestMessage ? (
              <>
                <p className="sender" style={{ opacity: 0.7 }}>
                  {user?.latestMessage?.sender?.name}
                </p>
                <p
                  style={{
                    transform: "translate(-5px, -1px)",
                    marginLeft: 1,
                    marginRight: 1,
                  }}
                >
                  :
                </p>
              </>
            ) : (
              <></>
            )}

            <p
              style={{
                opacity: 0.4,
                maxWidth: `${
                  screen.width <= 520
                    ? screen.width - 130
                    : Number(sidebarWidth) - 20
                }px`,
              }}
              className="latest-message"
            >
              {user?.latestMessage?.content}
            </p>
            <span
              style={{
                opacity: "0",
                zIndex: "-100",
                position: "relative",
                wordBreak: "keep-all",
              }}
            >
              placeholderplaceholderplaceholderplaceholderplaceholderplaceholderplaceholderplaceholderplaceholderplaceholderplaceholderplaceholderplaceholderplaceholderplaceholder
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// function useForceUpdate() {
//   const [value, setValue] = useState(0) // integer state
//   return () => setValue((value) => value + 1) // update state to force render
// }

export default UserListItem;
