import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Container, Button, Icon, Title, Item, Input, Form, Text, View, } from 'native-base';
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import colors from "../config/colors";
console.disableYellowBox
import { AuthContext } from "../navigation/AuthProvider";
import Loading from "../components/Loading";
import { firebase } from "../components/firebase";
import * as Font from 'expo-font';
import { EvilIcons, AntDesign, FontAwesome5, Entypo, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const Protected = ({ navigation, route }) => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hidden, setHidden] = useState('');
    const [list, setList] = useState('');
    const [loading, setLoading] = useState(true);
    const { thread } = route.params;
    const onsignin = () => {
        if (!password) {
            alert("input fields cannot be as empty as like that")
        } else {
            if (thread.password == password) {
                navigation.navigate('Room', { thread: thread })
            } else {
                if (thread.password == undefined) {

                    if (password == '123456') {
                        navigation.navigate('Room', { thread: thread })
                    }
                    else {
                        alert(`error: password for the group ${thread.name} is invalid`);
                    }
                } else {
                    alert(`password for the group ${thread.name} is invalid`);
                }
            }
        }
    }
    useEffect(() => {
        async function load() {
            await Font.loadAsync({
                'Roboto': require('native-base/Fonts/Roboto.ttf'),
                'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
                ...Ionicons.font,
            })
        }
        const subscriber = firebase.firestore()
            .collection('THREADS')
            .onSnapshot(querySnapshot => {
                const Groups = [];
                querySnapshot.forEach(documentSnapshot => {
                    Groups.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                setList(Groups);

                console.log(list);
            });
        setLoading(false);
        return () => subscriber();
    }, []);

    if (loading) {
        return (
            <Loading />
        );
    }
    return (
        <Container style={styles.screen}>

            <Text style={styles.header}>

                Protected Group 🛡️ {thread.name}

            </Text>
            <Text style={styles.headersubscript}>



            </Text>
            <View style={styles.container}>

                <Form style={styles.form}>
                    <Item style={{ marginTop: 50 }}>

                        <Icon active name='user-secret' style={styles.icon} type='FontAwesome' />

                        <Input placeholder="Password" style={styles.input}
                            value={password}
                            onChangeText={(userPassword) => setPassword(userPassword)}
                            secureTextEntry
                        />

                    </Item>

                    <Button style={styles.button}
                        onPress={onsignin}
                    >
                        <Text>Enter Group</Text>

                    </Button>

                </Form>
            </View>
        </Container>
    );
};


export default Protected;

const styles = StyleSheet.create({
    screen: { backgroundColor: 'black', paddingTop: 100 },
    header: { color: 'red', fontSize: 30, fontWeight: 'bold', marginLeft: 10 },
    headersubscript: { color: 'white', marginLeft: 10 },
    form: { justifyContent: 'center', },
    container: { marginTop: 100 },
    icon: { color: 'red' },
    input: { color: "white" },
    button: { justifyContent: "center", alignSelf: 'center', borderRadius: 20, marginTop: 20, width: 250, backgroundColor: '#4ecdc4' },
    bottomitem: { justifyContent: 'center', alignSelf: 'center', borderRadius: null, borderBottomWidth: null },
    bottombutton: { justifyContent: "center", alignSelf: 'center', borderRadius: 20, width: 250, backgroundColor: 'red' },
    text: { color: 'white', textTransform: 'capitalize' }
})
