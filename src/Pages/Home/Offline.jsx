import { Box, Text, useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";

const Offline = () => {
  const toast = useToast();
  useEffect(() => {
    toast({
      title: "You're Offline!",
      description: "Failed to Load the Pages",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  }, []);
  return (
    <>
      <Box>
        <Text color={"red"}>Sorry, no internet</Text>
      </Box>
    </>
  );
};

export default Offline;
