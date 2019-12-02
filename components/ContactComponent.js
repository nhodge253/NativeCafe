import React, { Component } from "react";
import { Text, ScrollView } from "react-native";
import { Card } from "react-native-elements";

class Contact extends Component {
  static navigationOptions = {
    title: "Contact"
  };

  render() {
    return (
      <ScrollView>
        <Card
          featuredTitle="Reach Out"
          image={require("./images/interior.jpg")}
        >
          <Text style={{ margin: 10 }}>121, Clear Water Bay Road</Text>
          <Text style={{ margin: 10 }}>Clear Water Bay, Kowloon HONG KONG</Text>
          <Text style={{ margin: 10 }}>Tel:+852 1234 5678</Text>
          <Text style={{ margin: 10 }}>Fax: +852 8765 4321</Text>
          <Text style={{ margin: 10 }}>Email:confusion@food.net</Text>
        </Card>
      </ScrollView>
    );
  }
}

export default Contact;
