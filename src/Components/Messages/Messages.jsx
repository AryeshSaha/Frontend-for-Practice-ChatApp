import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../Context/ChatProvider";
import {
  Avatar,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";
import { useState } from "react";

const Messages = ({ msgs }) => {
  const { user } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  const handleImgClick = (link) => {
    onOpen();
    setSelectedImageUrl((prev) => (prev === link ? "" : link));
  };

  return (
    <>
      <ScrollableFeed>
        {msgs &&
          msgs.map((msg, i) => {
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
                      src={msg.sender.profilePic}
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
                          mt={3}
                          p={3}
                        />
                      </>
                    ) : (
                      <>
                        <p>{msg.content}</p>
                      </>
                    )
                  ) : (
                    <>
                      {msg.images.length &&
                        msg.images.map((link, index) => (
                          <div key={index}>
                            <Image
                              boxSize="200px"
                              onClick={() => handleImgClick(link)}
                              src={link}
                              alt="media"
                              mt={3}
                            />
                            <Modal
                              onClose={onClose}
                              size={"full"}
                              isOpen={isOpen}
                            >
                              <ModalOverlay />
                              <ModalContent>
                                <ModalHeader>Image</ModalHeader>
                                <ModalCloseButton size={"lg"} />
                                <ModalBody
                                  display={"flex"}
                                  justifyContent={"center"}
                                  alignItems={"center"}
                                >
                                  <Image
                                    // boxSize={[ "auto", "50%", "40%" ]}
                                    src={selectedImageUrl}
                                    alt="media"
                                    objectFit="cover"
                                  />
                                </ModalBody>
                              </ModalContent>
                            </Modal>
                          </div>
                        ))}
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
