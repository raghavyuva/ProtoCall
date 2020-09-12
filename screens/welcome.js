import Onboarding from 'react-native-onboarding-swiper';
import React from 'react';
import { StyleSheet, Text, View ,Image} from "react-native";
import Svg, { Circle, Rect } from 'react-native-svg';

export default class Welcome extends React.Component{
constructor(props){
    super(props);
}
render(){
    return(
<Onboarding
    onDone={() => this.props.navigation.navigate('Signup')}
    onSkip={()=>this.props.navigation.navigate('Login')}
    pages={[
      {
        backgroundColor: '#b94c57',
        image: <Image source={require('../assets/onboard1.png')} style={{width:300,height:300}} />,
        title: 'Instant Messaging',
        subtitle: 'Get connected to people within seconds',
      },
      {
        backgroundColor: 'green',
        image:  <Image source={require('../assets/onboard2.png')} style={{width:300,height:300}} />,
        title: 'Everywhere Together',
        subtitle: 'Together with the app,Together to the app',
      },
      {
        backgroundColor: '#6b028d',
        image:  <Image source={require('../assets/onboard3.png')}  style={{width:300,height:300}} />,
        title: 'Faster than anything',
        subtitle: "This is what you looking, isn't it?",
      },
    ]}
    bottomBarColor='black'
  />
    );
}
}