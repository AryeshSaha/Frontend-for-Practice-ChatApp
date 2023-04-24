import { AddIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  Input,
  Box,
  FormLabel,
  FormControl,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../../Context/ChatProvider";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dpInput, setDpInput] = useState(false);
  const [dpUrl, setDpUrl] = useState("");
  const [dp, setDp] = useState(null);
  const { url, setUser } = ChatState();
  const toast = useToast();

  const handleDPChange = (e) => {
    setDp(e.target.files[0]);
    setDpUrl(URL.createObjectURL(e.target.files[0]));
  };

  const dpHandler = async (dp) => {
    const formData = new FormData();

    formData.append("file", dp);
    formData.append("upload_preset", "chat-app");
    formData.append("folder", `ProfilePics/${user?.email}`);

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/aryesh/image/upload",
        formData
      );
      setDp(null);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${url}/api/user/uploadDp`,
        { profilePic: res?.data?.secure_url },
        config
      );

      setUser((prev) => {
        return { ...prev, profilePic: res?.data?.secure_url };
      });

      setDpUrl("");

      toast({
        title: "Successfully saved",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        colorScheme="blackAlpha"
      >
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent h="auto">
          <ModalHeader fontSize="40px" display="flex" justifyContent="center">
            {user?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={dpUrl ? dpUrl : user?.profilePic}
              alt={user?.name}
            />
            <FormControl
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              w={"50%"}
              my={3}
            >
              <FormLabel
                htmlFor="dp"
                display={!dpInput ? "none" : "flex"}
                cursor={"pointer"}
                justifyContent={"space-evenly"}
                alignItems={"center"}
                w={"45%"}
                px={"10px"}
              >
                Image
                <AddIcon fontSize={"20px"} />
              </FormLabel>
              <Input
                type="file"
                id="dp"
                accept="image/*"
                display={"none"}
                onChange={handleDPChange}
              />
            </FormControl>

            <Box
              display={"flex"}
              justifyContent={"space-evenly"}
              alignItems={"center"}
            >
              <Button
                variant={"outline"}
                colorScheme="messenger"
                mt={2}
                mx={3}
                onClick={() => dpHandler(dp)}
                display={!dpInput ? "none" : ""}
              >
                Save
              </Button>
              <Button
                variant={"outline"}
                colorScheme="messenger"
                mx={3}
                mt={2}
                onClick={() => setDpInput(!dpInput)}
              >
                {!dpInput ? "Upload" : "Cancel"}
              </Button>
            </Box>
            <Text fontSize={{ base: "28px", md: "30px" }}>
              Email: {user?.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
