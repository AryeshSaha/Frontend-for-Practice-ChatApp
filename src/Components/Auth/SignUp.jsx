import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const SignUp = () => {
  const { url } = ChatState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !pass || !confirmPass) {
      toast({
        title: "Please fill",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (!pass !== !confirmPass) {
      toast({
        title: "Passwords don't match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${url}/api/user/register`,
        {
          name,
          email,
          password: pass,
        },
        config
      );

      toast({
        title: "Successfully Registered",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <VStack spacing={"5px"}>
        {/* Name */}
        <FormControl id="name" isRequired>
          <FormLabel>Name:</FormLabel>
          <Input
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        {/* Email */}
        <FormControl id="emai-reg" isRequired>
          <FormLabel>Email:</FormLabel>
          <Input
            type="email"
            placeholder="Enter Your Name"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        {/* Password */}
        <FormControl id="pass-reg" isRequired>
          <FormLabel>Password:</FormLabel>
          <InputGroup size={"md"}>
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter Your Name"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <InputRightElement w={"4.5rem"}>
              <Button
                h={"1.75rem"}
                bg={"none"}
                size={"em"}
                onClick={() => setShow((prev) => !prev)}
              >
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {/* Confirm Password */}
        <FormControl id="confirmPass" isRequired>
          <FormLabel>Confirm Password:</FormLabel>
          <InputGroup size={"md"}>
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter Your Name"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            <InputRightElement w={"4.5rem"}>
              <Button
                h={"1.75rem"}
                bg={"none"}
                size={"em"}
                onClick={() => setShow((prev) => !prev)}
              >
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          colorScheme="blue"
          w={"100%"}
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Sign Up
        </Button>
      </VStack>
    </>
  );
};

export default SignUp;
