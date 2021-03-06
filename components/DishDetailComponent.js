import React, { Component } from "react";
import { Text, View, ScrollView, FlatList, StyleSheet, Modal, Button } from "react-native";
import { Card, Icon, Rating, Input } from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import { postFavorite } from "../redux/ActionCreators";
import { postComment } from "../redux/ActionCreators";

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  };
};

const mapDispatchToProps = dispatch => ({
  postFavorite: dishId => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
});

function RenderDish(props) {
  const dish = props.dish;

  if (dish != null) {
    return (
      <Card featuredTitle={dish.name} image={{ uri: baseUrl + dish.image }}>
        <Text style={{ margin: 10 }}>{dish.description}</Text>
        <View style={styles.cardRow}>
          <Icon
            raised
            reverse
            name={props.favorite ? "heart" : "heart-o"}
            type="font-awesome"
            color="#f50"
            onPress={() => (props.favorite ? console.log("Already favorite") : props.onPress())}
          />
          <Icon
            raised
            reverse
            style={styles.cardItem}
            type="font-awesome"
            name="pencil"
            onPress={() => props.onShowModal()}
          />
        </View>
      </Card>
    );
  } else {
    return <View></View>;
  }
}

function RenderComments(props) {
  const comments = props.comments;

  const renderCommentItem = ({ item, index }) => {
    return (
      <View key={index} style={{ margin: 10 }} alignItems="flex-start">
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <Rating readonly startingValue={item.rating} imageSize={16}>
          {" "}
        </Rating>
        <Text style={{ fontSize: 12 }}>{"-- " + item.author + ", " + item.date} </Text>
      </View>
    );
  };

  return (
    <Card title="Comments">
      <FlatList data={comments} renderItem={renderCommentItem} keyExtractor={item => item.id.toString()} />
    </Card>
  );
}

class DishDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: [],
      showModal: false,
      rating: 3,
      author: "",
      comment: ""
    };
  }

  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  resetForm() {
    this.setState({
      guests: 1,
      smoking: false,
      rating: 5,
      date: ""
    });
  }

  handleComment(dishId) {
    this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
    this.toggleModal();
  }

  static navigationOptions = {
    title: "Dish Details"
  };

  render() {
    const dishId = this.props.navigation.getParam("dishId", "");
    return (
      <ScrollView>
        <RenderDish
          dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some(el => el === dishId)}
          onPress={() => this.markFavorite(dishId)}
          onShowModal={() => this.toggleModal()}
        />
        <RenderComments comments={this.props.comments.comments.filter(comment => comment.dishId === dishId)} />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.showModal}
          onDismiss={() => {
            this.toggleModal();
            this.resetForm();
          }}
          onRequestClose={() => {
            this.toggleModal();
            this.resetForm();
          }}
        >
          <View style={styles.modal}>
            <Rating
              type="star"
              startingValue={this.state.rating}
              ratingCount={5}
              imageSize={60}
              showRating
              onFinishRating={rating => this.setState({ rating: rating })}
            ></Rating>
            <Input
              onChangeText={author => this.setState({ author: author })}
              placeholder="Author:"
              leftIcon={{ type: "font-awesome", name: "pencil" }}
            ></Input>
            <Input
              onChangeText={comment => this.setState({ comment: comment })}
              placeholder="Comment:"
              leftIcon={{ type: "font-awesome", name: "pencil" }}
            ></Input>
            <View style={{ margin: 10, justifyContent: "space-between" }}>
              <Button
                onPress={() => {
                  this.toggleModal();
                  this.resetForm();
                }}
                color="#512DA8"
                title="Cancel"
              />
            </View>
            <View style={{ margin: 10, justifyContent: "space-between" }}>
              <Button
                onPress={() => {
                  this.handleComment(dishId);
                }}
                color="#512DA8"
                title="Submit"
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  cardRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20
  },
  cardItem: {
    flex: 1,
    margin: 10,
    color: "red"
  },
  modal: {
    justifyContent: "center",
    margin: 20
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
