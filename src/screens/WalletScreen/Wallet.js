import { View, SafeAreaView, Dimensions } from "react-native";
import {
  NativeBaseProvider,
  Button,
  Stack,
  Modal,
  FormControl,
  Input,
  FlatList,
  HStack,
  VStack,
  Spacer,
  Text,
  Box,
} from "native-base";
import Footer from "../../components/Footer";
import React, { useState, useCallback, useEffect } from "react";
import Header from "../../components/Header";
import { useFonts } from "expo-font";
import client from "../../API/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

//@ts-nocheck
const Wallet = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    CenturyGothic: require("../../../assets/fonts/CenturyGothic.ttf"),
    InterLight: require("../../../assets/fonts/Inter-Light.ttf"),
    InterBold: require("../../../assets/fonts/Inter-Bold.ttf"),
    InterMedium: require("../../../assets/fonts/Inter-Medium.ttf"),
    InterSemibold: require("../../../assets/fonts/Inter-SemiBold.ttf"),
  });

  const [placement, setPlacement] = useState(undefined);
  const [openAddWallet, setOpenAddWallet] = useState(false);
  const [walletsFetchData, setWalletFetchData] = useState([]);
  const [addWalletData, setAddWalletData] = useState({
    walletName: "",
    walletInitialBalance: "",
  });

  const openModal = (placement) => {
    setPlacement(placement);
  };

  const addWallet = async () => {
    await client
      .post("/createWallet", {
        balance: addWalletData.walletInitialBalance,
        name: addWalletData.walletName,
        idUser: await AsyncStorage.getItem("id"),
      })
      .then(function (response) {
        console.log(response.status);
        if (response.status == "200") {
          // navigation.navigate("Signin");
          setOpenAddWallet(false);
        }
      })
      .catch(function (error) {
        console.error(error);
        console.log("masuk catch");
      });
  };

  const udpateWalletLocalStorage = async () => {
    const id = await AsyncStorage.getItem("id");

    client
      .get("/getAccountDetail", {
        params: {
          idUser: id,
        },
      })
      .then(async function (response) {
        await AsyncStorage.setItem(
          "wallet",
          JSON.stringify(response.data.wallet)
        );

        setWalletFetchData(JSON.parse(await AsyncStorage.getItem("wallet")));
        // console.log(walletsFetchData);
      })
      .catch(function (error) {
        console.error(error);
        console.log("masuk catch");
      });
  };

  useEffect(() => {
    console.log("USE EFFECT DI AWAL");
    const udpateWalletLocalStorage = async () => {
      const id = await AsyncStorage.getItem("id");

      client
        .get("/getAccountDetail", {
          params: {
            idUser: id,
          },
        })
        .then(async function (response) {
          await AsyncStorage.setItem(
            "wallet",
            JSON.stringify(response.data.wallet)
          );

          setWalletFetchData(JSON.parse(await AsyncStorage.getItem("wallet")));
          // console.log(walletsFetchData);
        })
        .catch(function (error) {
          console.error(error);
          console.log("masuk catch");
        });
    };
    udpateWalletLocalStorage();
  }, []);

  const getWallet = async () => {
    setWalletFetchData(JSON.parse(await AsyncStorage.getItem("wallet")));
  };

  const getWalletfromAPI = async () => {
    const id = await AsyncStorage.getItem("id");
    client
      .get("/getWallet", {
        params: {
          idUser: id,
        },
      })
      .then(function (response) {
        console.log(response.status);
        setWalletFetchData(response.data);
      })
      .catch(function (error) {
        console.error(error);
        console.log("masuk catch");
      });
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Wallets" />
      <NativeBaseProvider>
        <View>
          <View style={{ height: "80%", marginTop: 20, paddingHorizontal: 20 }}>
            <Text py={"5"} style={{ fontFamily: "InterBold" }}>
              Select Wallet
            </Text>

            <Box>
              <FlatList
                data={walletsFetchData}
                renderItem={({ item }) => (
                  <Box
                    borderBottomWidth="1"
                    _dark={{
                      borderColor: "muted.50",
                    }}
                    borderColor="muted.800"
                    pl={["0", "4"]}
                    pr={["0", "5"]}
                    py="4"
                    alignItems={"center"}
                    key={walletsFetchData.idwallet}
                  >
                    <HStack space={[2, 3]} paddingX={2}>
                      <VStack justifyContent={"center"}>
                        <Text
                          _dark={{
                            color: "warmGray.50",
                          }}
                          color="coolGray.800"
                          bold
                          alignSelf={"center"}
                          fontSize={17}
                        >
                          {item.namewallet}
                        </Text>
                      </VStack>
                      <Spacer />
                      <VStack>
                        <Text style={{ fontSize: 12 }}>Total Balance</Text>
                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                          Rp{" "}
                          {item.balancewallet
                            .toFixed(2)
                            .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                )}
                keyExtractor={(item) => item.id}
              />
            </Box>

            <Stack
              direction={{
                base: "column",
                md: "row",
              }}
              space={2}
            >
              <Button
                onPress={() => {
                  openModal("bottom");
                  setOpenAddWallet(true);
                }}
              >
                Add Wallet
              </Button>
            </Stack>
          </View>
        </View>

        <Modal
          isOpen={openAddWallet}
          onClose={() => setOpenAddWallet(false)}
          safeAreaTop={true}
          style={{ minWidth: Dimensions.get("screen").width }}
          borderRadius={36}
          size="full"
        >
          <Modal.Content
            width={Dimensions.get("screen").width}
            minHeight={Dimensions.get("screen").height - 200}
            {...styles[placement]}
          >
            <Modal.CloseButton />
            <Modal.Header>Add Wallet</Modal.Header>
            <Modal.Body>
              <FormControl>
                <FormControl.Label>Name</FormControl.Label>
                <Input
                  placeholder=""
                  value={addWalletData.walletName}
                  onChangeText={(name) =>
                    setAddWalletData({ ...addWalletData, walletName: name })
                  }
                />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Initial Balance (Rp)</FormControl.Label>
                <Input
                  keyboardType="numeric"
                  placeholder="Rp 50,000"
                  value={addWalletData.walletInitialBalance}
                  onChangeText={(initialBalance) =>
                    setAddWalletData({
                      ...addWalletData,
                      walletInitialBalance: initialBalance,
                    })
                  }
                />
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setOpenAddWallet(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onPress={() => {
                    addWallet();
                  }}
                >
                  Save
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
        <Footer navigation={navigation} selected={1} />
      </NativeBaseProvider>
    </SafeAreaView>
  );
};
export default Wallet;
const styles = {
  top: {
    marginBottom: "auto",
    marginTop: 0,
  },
  bottom: {
    marginBottom: 0,
    marginTop: "auto",
  },
  left: {
    marginLeft: 0,
    marginRight: "auto",
  },
  right: {
    marginLeft: "auto",
    marginRight: 0,
  },
  center: {},
};
