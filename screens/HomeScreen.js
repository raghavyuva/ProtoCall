import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Title, Divider, List } from "react-native-paper";
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
  // const { user, logout } = useContext(AuthContext);
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("THREADS")
      // .orderBy("latestMessage.createdAt", "desc")
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
    <View>
      <FlatList
        data={threads}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Room", { thread: item })}
          >
            <List.Item
              title={item.name}
              description={item.latestMessage.text}
              titleStyle={styles.listTitle}
              titleNumberOfLines={1}
              descriptionStyle={styles.listDescription}
              descriptionNumberOfLines={1}
            />
          </TouchableOpacity>
        )}
      />
    </View>
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
  },
  listDescription: {
    fontSize: 16,
  },
});
