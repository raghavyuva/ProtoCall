import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Share,
  TouchableOpacity,
  Linking,
  ImageBackground,
  Dimensions
} from "react-native";
import {
  Avatar,
  TouchableRipple,
  Switch
} from 'react-native-paper';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import { Title, Divider, } from "react-native-paper";
import { Header, Button, Icon, Left, Body, Right, Container, Card, Item, Input, Fab, List, ListItem, Thumbnail, CardItem } from 'native-base';
import FormButton from "../components/FormButton";
import colors from "../config/colors";
import { AuthContext } from "../navigation/AuthProvider";
import { firebase } from "../components/firebase";
import Loading from "../components/Loading";
import useStatusBar from "../utils/useStatusBar";
import { firestore } from "firebase";
import { Entypo, MaterialIcons } from '@expo/vector-icons';
const HomeScreen = ({ navigation, }) => {
  useStatusBar("dark-content");
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [render, setRender] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [active, setActive] = useState(false);
  const currentUser = user.toJSON();
  const Super = currentUser.email;
  const FlatListItemSeparator = () => <View style={styles.line} />;
  const colors = ['#1b262c', '#0f4c75', '#3282b8', '#6b028d', "#221f3b", '#c42b71']
  useEffect(() => {
    firebase.firestore().collection('users')
      .doc(currentUser.uid).onSnapshot(document => {
        let data = document.data();
        setUsers(data);
      })
    const unsubscribe = firebase
      .firestore()
      .collection("THREADS")
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {

          return {
            _id: documentSnapshot.id,
            name: "",
            avatar: '',
            latestMessage: {
              text: "",
              createdAt: ''
            },
            ...documentSnapshot.data(),
          };
        });
        setThreads(threads)
        if (loading) {
          setLoading(false);
        }
      });
    return () => unsubscribe();
  }, []);
  const toggling = () => {
    setEnabled(!enabled);
  }
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "hey, this app is cool, i really enjoyed this. im on this app join me by using this application ",
        url: 'https://raghav.orak.in'
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <Container style={{ backgroundColor: 'black' }}>

      <View>
        {enabled == false ? (
          <>
            <Header style={{ backgroundColor: '#221f3b' }}>
              <Left>
                <Button transparent onPress={() => {
                  navigation.openDrawer();
                }}>
                  <Icon name='menu' />
                </Button>
              </Left>
              <Body>
                <Title style={{ color: 'white' }}>Home</Title>
              </Body>
              <Right>
                <Button transparent onPress={toggling}>
                  <Icon name='search' type='FontAwesome5' />
                </Button>
                {Super == 'raghav@bhat.com' ? (
                  <>
                    <Button transparent onPress={() => navigation.navigate('SuperAdmin')}>
                      <Icon name='user-secret' type='FontAwesome5' />
                    </Button>
                  </>
                ) : (
                    <View>
                    </View>
                  )}


                <Button transparent onPress={() => navigation.navigate('profile')}>
                  <Avatar.Image
                    source={{ uri: users.avatar }}
                    size={30}
                  />
                </Button>
              </Right>
            </Header>
          </>

        ) : (
            <Header searchBar rounded style={{ backgroundColor: '#221f3b' }}>
              <Item>
                <Icon name="ios-search" />
                <Input placeholder="What you are looking for?" clearButtonMode='always' autoCapitalize='none' autoCorrect={false} />
                <Button transparent onPress={toggling}>
                  <Entypo name="cross" size={26} color="red" />
                </Button>
              </Item>
              <Button transparent>
                <Text>Search</Text>
              </Button>
            </Header>
          )
        }

      </View>
      <ImageBackground source={require('../assets/home.jpg')} style={{ width: screenWidth, height: screenHeight }} >
        <FlatList
          data={threads}
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={FlatListItemSeparator}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                if (Super == 'raghav@bhat.com') {
                  navigation.navigate("Room", { thread: item })
                } else {
                  navigation.navigate("protected", { thread: item })
                }
              }
              }
            >
              <Card style={{ backgroundColor: colors[index % colors.length] }}
              >
                <CardItem avatar cardBody style={{ backgroundColor: colors[index % colors.length] }}>
                  <Left>
                    <Thumbnail source={{ uri: item.avatar }} />

                    <Body>
                      <Text style={styles.listTitle} numberOfLines={1}>{item.name}</Text>
                      <Text note style={styles.listDescription} numberOfLines={3}>{item.latestMessage.messagebyemail}: {item.latestMessage.text}</Text>
                    </Body>
                  </Left>
                  <Right>
                    <Text note style={{ color: 'white' }}>{new Date(item.latestMessage.createdAt).toDateString()}</Text>
                  </Right>
                </CardItem>
              </Card>
            </TouchableOpacity>
          )}
        />
        <Fab
          active={active}
          direction="up"
          containerStyle={{}}
          style={{ backgroundColor: 'brown', marginBottom: 60 }}
          position="bottomRight"
          onPress={() => setActive(!active)}>
          <Icon name="plus" type='Entypo' />
          <Button style={{ backgroundColor: '#34A34F' }} onPress={() => {
            navigation.navigate('SuperAdmin');
          }}  >
            <Icon name="new-message" type='Entypo' />
          </Button>
          <Button style={{ backgroundColor: '#3B5998' }} onPress={onShare}>
            <Icon name="share" />
          </Button>
          <Button style={{ backgroundColor: '#DD5' }} onPress={() => Linking.openURL('https://raghav.orak.in/releases')}>
            <MaterialIcons name="new-releases" size={24} color="black" />
          </Button>
        </Fab>
      </ImageBackground>
    </Container>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light,
    flex: 1,
  },
  listTitle: {
    fontSize: 22,
    color: 'white'
  },
  listDescription: {
    fontSize: 16,
    color: 'white'
  },
  line: {
    height: 0.5,
    width: "100%",
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.5)"
  },
});
