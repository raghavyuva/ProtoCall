import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Title, Divider, } from "react-native-paper";
import { Header, Button, Icon, Left, Body, Right, Container, Card } from 'native-base';
import FormButton from "../components/FormButton";
import colors from "../config/colors";
import { AuthContext } from "../navigation/AuthProvider";
import { firebase } from "../components/firebase";
import Loading from "../components/Loading";
import useStatusBar from "../utils/useStatusBar";

const HomeScreen = ({ navigation }) => {
  useStatusBar("dark-content");
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const currentUser = user.toJSON();
  const Super = currentUser.email;
  const FlatListItemSeparator = () => <View style={styles.line} />;
  const colors = ['#1b262c', '#0f4c75', '#3282b8', '#6b028d', "#221f3b", '#c42b71']

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("THREADS")
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {

          return {
            _id: documentSnapshot.id,
            name: "",
            latestMessage: {
              text: "",
            },
            ...documentSnapshot.data(),
          };
        });
        setThreads(threads);

        if (loading) {
          setLoading(false);
        }
      });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Container style={{ backgroundColor: 'black' }}>
      <Header style={{ backgroundColor: 'red' }}>
        <Left>
          <Button transparent onPress={() => logout()}>
            <Icon name='exit' />
          </Button>
        </Left>
        <Body>
          <Title style={{ color: 'white' }}>Home</Title>
        </Body>
        <Right>
          {
            Super == 'super@admin.com' ? (
              <Button transparent onPress={() => navigation.navigate('SuperAdmin')}>
                <Icon name='user-secret' type='FontAwesome5' />
              </Button>
            ) : (
                <View></View>
              )
          }
        </Right>
      </Header>
      <FlatList
        data={threads}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={FlatListItemSeparator}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Room", { thread: item })}
          >
            <Card style={{ backgroundColor: colors[index % colors.length] }}
            >
              <Text style={styles.listTitle} numberOfLines={1}> {item.name} </Text>
              <Text note style={styles.listDescription} numberOfLines={3}> {item.latestMessage.text} </Text>
            </Card>
          </TouchableOpacity>
        )}
      />
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
