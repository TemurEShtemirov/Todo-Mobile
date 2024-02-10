import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import RNModal from "react-native-modal";

const API_URL = "http://localhost:4852/todo";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [isFinished, setIsFinished] = useState(false);


  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const createTodo = async () => {
    try {
      if (!newTodoTitle || !newTodoDescription) return;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTodoTitle,
          description: newTodoDescription,
          isFinished: isFinished,
        }),
      });
      const data = await response.json();
      setTodos([...todos, data]);
      setNewTodoTitle("");
      setNewTodoDescription("");
      setIsFinished(false);
      setModalVisible(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderTodo = ({ item }) => {
    return (
      <View key={item._id} style={{ marginBottom: 10 }}>
        <Text>Title: {item.title}</Text>
        <Text>Description: {item.description}</Text>
        <Text>Finished: {item.isFinished ? "Yes" : "No"}</Text>
        <TouchableOpacity
          onPress={() => deleteTodo(item._id)}
          style={{ backgroundColor: "red", padding: 5, borderRadius: 5 }}
        >
          <Text style={{ color: "white" }}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  
  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    createTodo();
  }, [newTodoTitle, newTodoDescription, isFinished]);

  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginTop: 40,
          backgroundColor: "#F1F1F1",
          width: "100%",
          height: 50,
          paddingTop: 10,
          paddingLeft: 135,
        }}
      >
        Todo List
      </Text>
      <FlatList
        data={todos}
        renderItem={renderTodo}
        keyExtractor={(item) => item._id.toString()}
        style={{ marginBottom: 10 }}
      />

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          backgroundColor: "blue",
          padding: 10,
          borderRadius: 5,
          marginHorizontal: 20,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Add Todo +</Text>
      </TouchableOpacity>
      <RNModal isVisible={isModalVisible}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{ backgroundColor: "white", padding: 50, borderRadius: 5 }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 10,
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              Add Todo
            </Text>
            <TextInput
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                marginBottom: 10,
                paddingHorizontal: 10,
                width: 250,
              }}
              onChangeText={(text) => setNewTodoTitle(text)}
              value={newTodoTitle}
              placeholder="Enter todo title"
            />
            <TextInput
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                marginBottom: 10,
                paddingHorizontal: 10,
              }}
              onChangeText={(text) => setNewTodoDescription(text)}
              value={newTodoDescription}
              placeholder="Enter todo description"
            />
            <TouchableOpacity
              onPress={() => setIsFinished(!isFinished)}
              style={{
                backgroundColor: isFinished ? "green" : "red",
                padding: 10,
                borderRadius: 5,
                marginBottom: 10,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                {isFinished ? "Mark as Unfinished" : "Mark as Finished"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={createTodo}
              style={{ backgroundColor: "green", padding: 5, borderRadius: 5 }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: "red",
                padding: 5,
                borderRadius: 5,
                marginTop: 10,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
    </View>
  );
};

export default App;
