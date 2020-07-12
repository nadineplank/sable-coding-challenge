import React, { useState, useLayoutEffect } from "react";
import { useAsyncStorage } from "@react-native-community/async-storage";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity
} from "react-native";

export default function App() {
  const { getItem, setItem } = useAsyncStorage("transactions");
  const [transactions, setTransactions] = useState([
    {
      id: "1",
      receiver: "5c7",
      sender: "9cd",
      amount: "99$",
      resolved: false,
      status: ""
    },
    {
      id: "2",
      receiver: "5c7",
      sender: "9cd",
      amount: "30$",
      resolved: false,
      status: ""
    },
    {
      id: "3",
      receiver: "5c7",
      sender: "9cd",
      amount: "130$",
      resolved: false,
      status: ""
    }
  ]);

  useLayoutEffect(() => {
    getData();
  }, []);

  // function for updating transactions with the new data from resolveTransaction
  const setData = async transactions => {
    try {
      await setItem(JSON.stringify(transactions));
      setTransactions(transactions);
    } catch (e) {
      console.log("error in setData: ", e);
    }
  };

  // sending inital object to local Storage
  const getData = async () => {
    try {
      const retrievedData = await getItem();
      retrievedData !== null && setTransactions(JSON.parse(retrievedData));
    } catch (e) {
      console.log("error in getData: ", e);
    }
  };

  // pass new data to matching object and send it to setData
  const resolveTransaction = async (id, value) => {
    try {
      const updatedTransactions = transactions.map(transaction => {
        if (transaction.id === id) {
          transaction.resolved = true;
          transaction.status = value;
        }
        return transaction;
      });
      setData(updatedTransactions);
    } catch (e) {
      console.log("error in resolveTransaction: ", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Suspicious Transactions</Text>
      <FlatList
        style={styles.flatlist}
        keyExtractor={transaction => transaction.id}
        data={transactions}
        renderItem={({ item, index }) => {
          if (item.resolved === false) {
            return (
              <View style={styles.list}>
                <Text>Transaction ID: {item.id}</Text>
                <Text>From user: {item.sender}</Text>
                <Text>To user: {item.receiver}</Text>
                <Text>Amount: {item.amount}</Text>
                <TouchableOpacity
                  onPress={() => resolveTransaction(item.id, "blocked")}
                  style={styles.button}
                >
                  <Text>Block</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => resolveTransaction(item.id, "allowed")}
                  style={styles.button}
                >
                  <Text>Allow</Text>
                </TouchableOpacity>
              </View>
            );
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    margin: 30
  },
  list: {
    marginVertical: 20
  },
  button: {
    margin: 10
  }
});
