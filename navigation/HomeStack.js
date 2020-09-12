import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body,  View, ListItem, Right, Radio, List, Title, ActionSheet, Form, Picker, Item, Input, Label } from 'native-base';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from "../screens/HomeScreen";
import colors from "../config/colors";
import AddRoomScreen from "../screens/AddRoomScreen";
import { AuthContext } from "./AuthProvider";
import { IconButton } from "react-native-paper";
import RoomScreen from "../screens/RoomScreen";
import SuperAdmin from '../components/SuperAdmin';
import Adduser from "../components/Addusertogroup";
import Protected from "../screens/protected";
import Profile from "../screens/profile";
import { DrawerContent } from "../components/Drawercontentscreen";
import Settings from "../components/settings";
import Feedback from "../components/feedback";
import Faqs from "../components/faqs";
import {
  Avatar,
  TouchableRipple,
  Switch
} from 'react-native-paper';
const ChatAppStack = createStackNavigator();
const ModalStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const ChatApp = () => {
  const { logout } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const currentUser = user.toJSON();
  const Super = currentUser.email;
  return (
    <ChatAppStack.Navigator
    mode='modal'
      screenOptions={{
        headerStyle: {
          backgroundColor: '#221f3b',
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontSize: 22,
        },


      }}

    >
      <ChatAppStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      <ChatAppStack.Screen
        name="Room"
        component={RoomScreen}
        options={({ route }) => ({
          title: route.params.thread.name,
         headerRight : ()=>{
         return(
          <Button transparent onPress={() => navigation.navigate('profile')} style={{margin:30}}>
          <Avatar.Image
            source={{ uri: route.params.thread.avatar }}
            size={50}
          />
        </Button>
         )
         }
        })}
      />
    </ChatAppStack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />} drawerPosition='left' drawerType='front'>
      <ModalStack.Screen name="ChatApp" component={ChatApp} />
      <ModalStack.Screen name="SuperAdmin" component={SuperAdmin} />
      <ModalStack.Screen name="adduser" component={Adduser} />
      <ModalStack.Screen name='profile' component={Profile} />
      <ModalStack.Screen name="protected" component={Protected} />
      <ModalStack.Screen name='settings' component={Settings} />
      <ModalStack.Screen name='feedback' component={Feedback} />
      <ModalStack.Screen name='faqs' component={Faqs} />
    </Drawer.Navigator>
  );
};

export default HomeStack;