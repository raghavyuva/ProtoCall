import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Container, Button, Card, CardItem, Left, ListItem, List, Body, Right, Thumbnail, Content, Header, Icon, Title, Item, Input, Text, Label } from 'native-base';
import { Constants, } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Font from 'expo-font';
import { EvilIcons, AntDesign, FontAwesome5, Entypo, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Loading from '../components/Loading';
import { Avatar } from 'react-native-elements';
const TAB_BAR_HEIGHT = 20;
import * as firebase from 'firebase';
require('firebase/auth');
require('firebase/firestore');
const { width: screenWidth } = Dimensions.get('window');
export default class Feedback extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        loading: true,
        content:null,
    }
    get firestore() {
        return firebase.firestore()
    }
    get uid() {
        return (firebase.auth().currentUser || {}).uid
    }
    get timestamp() {
        return Date.now()
    }
    async componentDidMount() {
        this.setState({ loading: false })
    }
    postfaq=()=>{
        let upload = firebase.firestore().collection('Faqs').add(
            {
                questions:this.state.content,
                uid:this.uid,
                time: new Date(),
                answer:null,
            }
        )
    }
    render() {
        if (this.state.loading) {
            return (
                <Loading />
            );
        }
        return (
            <Container >
                <View>
                    <Header style={{ backgroundColor: '#221f3b' }}>
                        <Left>
                            <Button transparent onPress={() => {
                                this.props.navigation.openDrawer();
                            }}>
                                <Icon name='menu' />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Feedback</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => this.props.navigation.goBack()} >
                                <Icon name='arrow-left' type='Feather' />
                            </Button>
                        </Right>
                    </Header>
                </View>
                <View style={{justifyContent:'center',alignContent:'center',marginTop:100}}>
                <Label style={{alignSelf:'center'}}>Any questions Regarding the app? </Label>
                <Item style={{width:screenWidth-100,marginLeft:50 }} regular>
                    <Input style={{ borderColor: 'green', borderRadius: 5, }} placeholder='ex: not able to send audio ' numberOfLines={20}                    
                    onChangeText={(content) => this.setState({ content })}
                    value={this.state.content}                    
                    />
                      
                
                </Item>
                <Button 
                style={{ width: screenWidth - 80, margin: 40, justifyContent: 'center' }}
                onPress={this.postfaq}
                >
                    <Text>let us know</Text>
                    </Button>
                </View>
            </Container>
        );
    }
}