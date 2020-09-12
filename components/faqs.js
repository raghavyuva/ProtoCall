import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Dimensions ,FlatList} from 'react-native';
import { Container, Button, Card, CardItem, Left, ListItem, List, Body, Right, Thumbnail, Content, Header, Icon, Title, Item, Input, Text, Label ,Accordion} from 'native-base';
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
export default class Faqs extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        loading: true,
        data:[],
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
       
        firebase.firestore().collection('Faqs').onSnapshot((documnetsnapshot)=>{
            const threads = documnetsnapshot.docs.map((querysnapshot) => {
            let datarecieved = querysnapshot.data();
         
            this.setState({data:datarecieved})
            console.log(this.state.data);
            this.setState({ loading: false })
            })
        })
       
        
    }

    render() {
        if (this.state.loading) {
            return (
                <Loading />
            );
        }
        return (
            <Container>
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
                            <Title>FAQs</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => this.props.navigation.goBack()} >
                                <Icon name='arrow-left' type='Feather' />
                            </Button>
                        </Right>
                    </Header>
                </View>
       
            </Container>
        );
    }
}