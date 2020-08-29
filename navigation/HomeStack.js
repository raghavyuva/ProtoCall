import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/HomeScreen";
import colors from "../config/colors";
import AddRoomScreen from "../screens/AddRoomScreen";
import { AuthContext } from "./AuthProvider";
import { IconButton } from "react-native-paper";
import RoomScreen from "../screens/RoomScreen";
import SuperAdmin from '../components/SuperAdmin';
import Adduser from "../components/Addusertogroup";
// const Stack = createStackNavigator();
const ChatAppStack = createStackNavigator();
const ModalStack = createStackNavigator();

const ChatApp = () => {
  const { logout } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const currentUser = user.toJSON();
  const Super = currentUser.email;
  return (
    <ChatAppStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.secondary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontSize: 22,
        },
      }}
      headerMode='none'
    >
      <ChatAppStack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <IconButton
            icon="message-plus"
            size={28}
            color={colors.white}
            onPress={() => navigation.navigate("SuperAdmin")}
         />
          ),
          headerLeft: () => (
            <IconButton
              icon="logout-variant"
              size={28}
              color={colors.white}
              onPress={() => logout()}
            />
          ),
        })}
      />

      <ChatAppStack.Screen
        name="Room"
        component={RoomScreen}
        options={({ route }) => ({
          title: route.params.thread.name,
        })}
      />
    </ChatAppStack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <ModalStack.Navigator mode="modal" headerMode="none">
      <ModalStack.Screen name="ChatApp" component={ChatApp} />
      <ModalStack.Screen name="SuperAdmin" component={SuperAdmin} />
      <ModalStack.Screen name="adduser" component={Adduser} />
    </ModalStack.Navigator>
  );
};

export default HomeStack;

// const HomeStack = () => {
//   return (
//     <ModalStack.Navigator
//       screenOptions={{
//         headerStyle: { backgroundColor: colors.secondary },
//         headerTintColor: colors.white,
//         headerTitleStyle: { fontSize: 22 },
//       }}
//     >
//       <Stack.Screen name="Home" component={HomeScreen} />
//     </ModalStack.Navigator>
//   );
// };
