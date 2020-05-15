import React, { Component } from 'react';
import {View, Text, Animated, Easing, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import {baseUrl} from "../shared/baseUrl";
import { connect } from  'react-redux'
import { Loading } from "./LoadingComponent";
import * as Animatable from  'react-native-animatable'

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        promotions: state.promotions,
        leaders: state.leaders,
        comments: state.comments
    }
}

function RenderItem(props) {

    const item = props.item;

    if(props.isLoading) {
        return (
            <Loading />
        )
    } else if(props.errMess) {
        return (
            <View>
                <Text>{props.errMess}</Text>
            </View>
        )
    } else {
        if (item != null) {
            return(
                <Card
                    featuredTitle={item.name}
                    featuredSubtitle={item.designation}
                    image={{ uri: baseUrl + item.image}}>
                    <Text
                        style={{margin: 10}}>
                        {item.description}</Text>
                </Card>
            );
        }
        else {
            return(<View></View>);
        }
    }


}

class Home extends Component {

    constructor(props) {
        super(props);

        // this.animatedValue = new Animated.Value(0); значення початкове анімації
    }

    static navigationOptions = {
        title: 'Home',
    };

    // componentDidMount() {
    //     this.animate()
    // }
    // це сама фунуція анімації
    // animate() {
    //     this.animatedValue.setValue(0)
    //     Animated.timing(
    //         this.animatedValue,
    //         {
    //             toValue: 8,
    //             duration: 8000,
    //             easing: Easing.linear
    //         }
    //     ).start(() => this.animate())
    // }

    render() {
        //Це кастомна анімація для компонента але вона гавняна або переробити або юзати яка зараз
        // const xpos1 = this.animatedValue.interpolate({
        //     inputRange: [0, 1, 3, 5, 8],
        //     outputRange: [1200, 600, 0, -600, -1200]
        // })
        // const xpos2 = this.animatedValue.interpolate({
        //     inputRange: [0, 2, 4, 6, 8],
        //     outputRange: [1200, 600, 0, -600, -1200]
        // })
        // const xpos3 = this.animatedValue.interpolate({
        //     inputRange: [0, 3, 5, 7, 8],
        //     outputRange: [1200, 600, 0, -600, -1200]
        // })
        return(
            <ScrollView>
                <Animatable.View animation='fadeInRightBig' duration={2000} delay={1000}>
                 {/*<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center'}}>*/}
                        {/*<Animated.View style={{ width: '100%', transform: [{ translateX: xpos1}]}}>*/}
                            <RenderItem
                            item={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
                            isLoading={this.props.dishes.isLoading}
                            errMess={this.props.dishes.errMess}
                            />
                        {/*</Animated.View>*/}
                        {/*<Animated.View style={{ width: '100%', transform: [{ translateX: xpos2}]}}>*/}
                            <RenderItem
                            item={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
                            isLoading={this.props.promotions.isLoading}
                            errMess={this.props.promotions.errMess}
                            />
                        {/*</Animated.View>*/}
                        {/*<Animated.View style={{ width: '100%', transform: [{ translateX: xpos3}]}}>*/}
                            <RenderItem
                            item={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
                            isLoading={this.props.leaders.isLoading}
                            errMess={this.props.leaders.errMess}
                            />
                        {/*</Animated.View>*/}
                    {/*</View>*/}
                </Animatable.View>
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps)(Home);