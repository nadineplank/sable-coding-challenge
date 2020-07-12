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
      <Text style={styles.header}>Suspicious Transactions</Text>
      <FlatList
        style={styles.flatlist}
        keyExtractor={transaction => transaction.id}
        data={transactions}
        renderItem={({ item, index }) => {
          if (item.resolved === false) {
            return (
              <View style={styles.list}>
                <Text style={styles.listText}>Transaction ID: {item.id}</Text>
                <Text style={styles.listText}>From user: {item.sender}</Text>
                <Text style={styles.listText}>To user: {item.receiver}</Text>
                <Text style={styles.listText}>Amount: {item.amount}</Text>
                <View style={styles.btnContainer}>
                  <TouchableOpacity
                    onPress={() => resolveTransaction(item.id, "blocked")}
                    style={styles.btn}
                  >
                    <Text>Block</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => resolveTransaction(item.id, "allowed")}
                    style={styles.btn}
                  >
                    <Text>Allow</Text>
                  </TouchableOpacity>
                </View>
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
  header: {
    fontSize: 25,
    margin: 10
  },
  list: {
    width: 300,
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7
  },
  listText: {
    fontSize: 17
  },
  btnContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  btn: {
    margin: 10,
    padding: 5,
    borderWidth: 2,
    borderColor: "lightgrey",
    borderRadius: 6,
    textAlign: "center"
  }
});
