import { Flex, Link, Tooltip, Image, Text, Button, Box } from "@chakra-ui/react";



export const Audited = ({ ...rest }) => {


  return (

      <Box
       
        isExternal
        display="block"
        aria-label="Info report"
        _hover={{ boxShadow: "0 0 0 2px var(--chakra-colors-chakra-body-text) inset" }}
        borderRadius="xl"
        backgroundImage={
          "radial-gradient(circle at bottom left, #00C1C165 0%, transparent 30%), radial-gradient(circle at top right, #7B61FF70 0%, transparent 50%)"
        }
        {...rest}
      >
        <Flex
          borderRadius="15px"
          flexDirection="column"
          bgColor="#fff"
          bgSize="cover"
          bgPosition="center"
          justifyContent="flex-start"
          alignItems="start"
          p="16px"
          minH="80px"
          minW="218px"
        >
          <Text fontSize="sm" color="black" fontWeight="bold">
            Audit
          </Text>
          <Image w="100%" h="64px" src={`/audited.png`} alt="XIMBIA" />
          <div className="flex justify-center w-full">
          <p fontSize="xs" className=" text-xs text-black py-2 text-center" color="black" mb="10px">
            Please check our Report
          </p>
          </div>

          <Link w="100%" href="https://blocksafu.com/project-detail/0x3bdeECae844b96A133F98e54e36eB85414ffe5c9">
            <Button
              fontSize="10px"
              fontWeight="bold"
              w="100%"
              mb={1}
              bg={"#9900d1"}
              className="py-2 rounded-lg"
              _active={{
                bg: "#9900d1",
                transform: "none",
                borderColor: "transparent"
              }}
              _focus={{
                boxShadow: "none"
              }}
              _hover={{
                bg: "#9900d1",
                transform: "none",
                borderColor: "transparent"
              }}
              color="white"
            >
              View Audited XMB
            </Button>
          </Link>

          <Link w="100%" href="https://blocksafu.com/project-detail/0x9945f6221Efee040a12054217504cBC230f0ACC9">
            <Button
              fontSize="10px"
              fontWeight="bold"
              w="100%"
              bg={"#9900d1"}
              className="py-2 rounded-lg mt-1"
              _hover={{
                bg: "#9900d1",
                transform: "none",
                borderColor: "transparent"
              }}
              _active={{
                bg: "#9900d1",
                transform: "none",
                borderColor: "transparent"
              }}
              _focus={{
                boxShadow: "none"
              }}
              color="white"
            >
              View Audited BTIC
            </Button>
          </Link>
        </Flex>
      </Box>
    
  );
};
