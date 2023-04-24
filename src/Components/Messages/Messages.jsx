import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../Context/ChatProvider";
import { Avatar, Box, Image, Tooltip } from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";

const Messages = ({ msgs }) => {
  const { user } = ChatState();

  return (
    <>
      <ScrollableFeed>
        {msgs &&
          msgs.map((msg, i) => {
            // console.log("msg: ", msg);
            return (
              <div
                key={msg._id}
                style={{ display: "flex", alignItems: "center" }}
              >
                {(isSameSender(msgs, msg, i, user) ||
                  isLastMessage(msgs, i, user)) && (
                  <Tooltip
                    label={msg.sender.name}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={msg.sender.name}
                      src={msg.sender.pic}
                    />
                  </Tooltip>
                )}
                <span
                  style={{
                    backgroundColor: `${
                      msg.sender._id === user._id ? "#00eeff" : "#00ff62"
                    }`,
                    marginLeft: isSameSenderMargin(msgs, msg, i, user),
                    marginTop: isSameUser(msgs, msg, i, user) ? 3 : 10,
                    borderRadius: "10px",
                    padding: "5px 15px",
                    maxWidth: "auto",
                    color: "#000000",
                  }}
                >
                  {msg.content ? (
                    msg.images?.length > 0 ? (
                      <>
                        <p>{msg.content}</p>
                        <Image
                          boxSize="200px"
                          src={msg.images[0]}
                          alt="media"
                        />
                      </>
                    ) : (
                      <>
                        <p>{msg.content}</p>
                      </>
                    )
                  ) : (
                    <>
                      <Image boxSize="200px" src={msg.images[0]} alt="media" />
                    </>
                  )}
                </span>
              </div>
            );
          })}
      </ScrollableFeed>
    </>
  );
};

export default Messages;
