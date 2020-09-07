import React, { useState, useContext, useEffect } from "react";
import { StyleSheet,TouchableOpacity} from "react-native";
import { Container, Button, Icon, Title, Item, Input, Form,Text, View ,} from 'native-base';
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import colors from "../config/colors";
console.disableYellowBox
import { AuthContext } from "../navigation/AuthProvider";
import * as Font from 'expo-font';
import { EvilIcons, AntDesign, FontAwesome5, Entypo, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidden, setHidden] = useState('');
  const [loading,setLoading] = useState(true);
  const onsignin = () =>{
    if (!email || !password) {
      alert("input fields cannot be as empty as like that")
    } else {
      login(email,password)
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
    setLoading(false);
}, []);
if (loading) {
  return(
    <Container></Container>
  )
}
  return (
    <Container style={styles.screen}>

      <Text style={styles.header}>

        Login 👋 
        
        </Text>
      <Text style={styles.headersubscript}>
        
        Login to your existing account or Create a new one
        
        </Text>
      <View style={styles.container}>

        <Form style={styles.form}>

          <Item>

            <Icon active name='user' style={styles.icon} type='FontAwesome' />

            <Input placeholder="Email Address" style={styles.input}
             value={email}
             onChangeText={(userEmail) => setEmail(userEmail)}
            />

            <TouchableOpacity onPress={() => alert('must be a vaid email address')}>

              <Icon active name='account-alert' style={styles.icon} type='MaterialCommunityIcons' />

            </TouchableOpacity>

          </Item>

          <Item style={{ marginTop: 50 }}>

            <Icon active name='user-secret' style={styles.icon} type='FontAwesome' />

            <Input placeholder="Password" style={styles.input}
              value={password}
              onChangeText={(userPassword) => setPassword(userPassword)}
             
            />

          </Item>

          <Button style={styles.button}
                 onPress={onsignin}
         >

            <Text>Sign in</Text>

          </Button>

        </Form>

        <View style={{ marginTop: 20 }}>

          <Item style={styles.bottomitem}>

            <Button style={styles.bottombutton} 
            onPress={()=>navigation.navigate('Signup')}
            >

              <Text style={styles.text}>Register an Account</Text>
              
            </Button>

          </Item>
        </View>
      </View>
  </Container>
  );
};


export default LoginScreen;

const styles = StyleSheet.create({
  screen: { backgroundColor: 'black', paddingTop: 100 },
  header: { color: 'red', fontSize: 30, fontWeight: 'bold', marginLeft: 10 },
  headersubscript: { color: 'white', marginLeft: 10 },
  form: { justifyContent: 'center', },
  container: { marginTop: 100 },
  icon: { color: 'red' },
  input: { color: "white" },
  button: { justifyContent: "center", alignSelf: 'center', borderRadius: 20, marginTop: 20, width: 250,backgroundColor:'#4ecdc4' },
  bottomitem: { justifyContent: 'center', alignSelf: 'center', borderRadius: null, borderBottomWidth: null },
  bottombutton: { justifyContent: "center", alignSelf: 'center', borderRadius: 20, width: 250, backgroundColor: 'red' },
  text: { color: 'white', textTransform: 'capitalize' }
})
