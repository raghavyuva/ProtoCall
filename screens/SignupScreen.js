import React, { useState, useContext ,useEffect} from "react";
import { StyleSheet,TouchableOpacity} from "react-native";
import { Container, Button, Icon, Title, Item, Input, Form,Text, View } from 'native-base';
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import colors from "../config/colors";
import { AuthContext } from "../navigation/AuthProvider";
import auth from 'firebase/auth';
import firestore from 'firebase/firestore';
import * as Font from 'expo-font';
import { EvilIcons, AntDesign, FontAwesome5, Entypo, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import firebase from 'firebase';
const SignupScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidden, setHidden] = useState('');
  const [name ,setName] = useState('');
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    async function load() {
        await Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
            ...Ionicons.font,
        })
    }
    setLoading(false);
}, []);
if (loading) {
  return(
    <Container></Container>
  )
}
  const onsignup = () =>{
    if (!email || !password) {
      alert("input fields cannot be as empty as like that")
    } else {
     register(email,password,name)
    }
  }
  return (
    <Container style={{ backgroundColor: 'black' }}>

                <View style={{ paddingTop: 100 }}>
                    <Text style={{ color: 'red', fontSize: 30, fontWeight: 'bold', marginLeft: 10 }}>Sign up 👋 </Text>
                    <Text style={{ color: 'white', marginLeft: 10 }}>Create your account to get started</Text>
                </View>

                <Form style={{ justifyContent: 'center', marginTop: 100 }}>
                    <Item>
                        <Icon active name='user' style={{ color: 'red' }} type='FontAwesome' />
                        <Input placeholder="Email Address" style={{ color: 'white' }}
                            onChangeText={(userEmail) => setEmail(userEmail)} value={email}
                        />
                        <TouchableOpacity onPress={() => alert('must be a vaid email address')}>
                            <Icon active name='account-alert' style={{ color: 'red' }} type='MaterialCommunityIcons' />
                        </TouchableOpacity>
                    </Item>


                    <Item style={{ marginTop: 50 }}>
                        <Icon active name='user' style={{ color: 'red' }} type='FontAwesome' />
                        <Input placeholder="Full Name" style={{ color: 'white' }}
                            onChangeText={(username) => setName(username)} value={name}
                        />
                    </Item>
                    <Item style={{ marginTop: 50 }}>
                        <Icon active name='user-secret' style={{ color: 'red' }} type='FontAwesome' />
                        <Input placeholder="Password" style={{ color: "white" }} secureTextEntry={hidden}
                            onChangeText={(userPassword) => setPassword(userPassword)} value={password}
                        />
                        <TouchableOpacity onPress={()=>setHidden(!hidden)}>
                            {hidden == false ? (
                                <Icon active name='eye' style={{ color: 'red' }} type='AntDesign' />
                            ) : (
                                    <Icon active name='eye-off' style={{ color: 'red' }} type='Feather' />

                                )
                            }
                        </TouchableOpacity>

                    </Item>

                    <Button style={{ justifyContent: "center", alignSelf: 'center', borderRadius: 20, marginTop: 20, width: 200, }}
                        onPress={onsignup}>
                        <Text>Sign Up</Text>
                    </Button>

                </Form>
                <Item style={{ justifyContent: 'center', marginTop: 10, alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={{ color: 'white' }}>
                            Already a user?
              </Text>
                    </TouchableOpacity>

                </Item>
            </Container>
  );
};

export default SignupScreen;

