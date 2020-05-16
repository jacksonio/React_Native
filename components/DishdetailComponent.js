import React, { Component } from 'react';
import {Text, View, ScrollView, FlatList, StyleSheet, Button, Modal, Alert, PanResponder} from 'react-native';
import { Card, Icon, Rating, Input} from 'react-native-elements';
import {baseUrl} from "../shared/baseUrl";
import { connect } from  'react-redux'
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from  'react-native-animatable'


const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, comment, author) => dispatch(postComment(dishId, rating, comment, author))
})

function RenderDish(props) {

    const dish = props.dish;

    handleViewRef = ref => this.view = ref;

    const recognizeDrag = ({ dx }) => {
        if( dx < -200) return true
        else  return false
    }

    const recoqnizeComment = ({dx}) => {
        if( dx > 200) return true
        else return false
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true
        },
        onPanResponderGrant: () => {
            this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'))
        },
        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState)){
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                    ],
                    { cancelable: false }
                );
            } else if(recoqnizeComment(gestureState)) {
                return props.onToggle()
            }

            return true;
        }
    })


    if (dish != null) {
        return(
            <Animatable.View animation='fadeInDown' duration={2000} delay={1000}
                             ref={this.handleViewRef}
                             {...panResponder.panHandlers}>
                <Card
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={styles.iconsRow}>
                    <Icon
                        raised
                        reverse
                        name={ props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                    />
                    <Icon
                        raised
                        reverse
                        name='pencil'
                        type='font-awesome'
                        color='#512da8'
                        onPress={() => props.onToggle()}
                    />
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    else {
        return(<View></View>);
    }
}

function RenderComments(props) {

    const comments = props.comments;

    const renderCommentItem = ({item, index}) => {

        return (
            <View key={index} style={styles.comment}>
                <Rating
                    imageSize={12}
                    readonly
                    startingValue={item.rating}
                    style={styles.rating}
                />
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', '}{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(item.date)))} </Text>
            </View>
        );
    };

    return (
        <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
            <Card title='Comments' >
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}

class Dishdetail extends Component{


    constructor(props) {
        super(props);

        this.state = {
            rating: 0,
            comment: '',
            author: '',
            showModal: false
        }
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId)
    }

    ratingCompleted(rating) {
        this.setState({
            rating: rating
        })
    }

    submitForm(dishId) {
        this.toggleModal()
        this.props.postComment(dishId, this.state.rating, this.state.comment, this.state.author)
    }

    static navigationOptions = {
        title: 'Dish Details'
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                            favorite={this.props.favorites.some(el => el === dishId)}
                            onPress={() => this.markFavorite(dishId)}
                            onToggle={() => this.toggleModal()}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId).reverse()} />
                <Modal animationType = {"slide"} transparent = {false}
                       visible = {this.state.showModal}
                       onDismiss = {() => this.toggleModal() }
                       onRequestClose = {() => this.toggleModal() } >
                    <View style = {styles.modal}>
                        <Text style = {styles.modalTitle}>Your Reservation</Text>
                        <Rating
                            showRating
                            onFinishRating={(rating) => this.ratingCompleted(rating)}
                            style={{ paddingVertical: 10 }}
                        />
                        <Input
                            placeholder="Author"
                            leftIcon={{ type: 'font-awesome', name: 'user' }}
                            style={styles.icon}
                            onChangeText={value => this.setState({ author: value })}
                        />
                        <Input
                            placeholder="Comment"
                            leftIcon={{ type: 'font-awesome', name: 'comment' }}
                            style={styles.icon}
                            onChangeText={value => this.setState({ comment: value })}
                        />
                        <View style={{ margin: 10}}>
                            <Button
                                onPress = {() =>{this.toggleModal(); this.submitForm(dishId)}}
                                color="#512DA8"
                                title="Submit"
                            />
                        </View>
                        <View style={{ margin: 10}} >
                            <Button
                                onPress = {() =>{this.toggleModal()}}
                                color="#808588"
                                title="Close"
                            />
                        </View>

                    </View>
                </Modal>
            </ScrollView>

        );
    }

}

const styles = StyleSheet.create({
    iconsRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row'
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    icon: {
        backgroundColor: 'transparent',
        color: '#fff'
    },
    comment: {
        alignItems: 'flex-start',
        margin: 10
    }

})

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);