import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

// Main App Component
const App = () => {
  const [screen, setScreen] = useState("Login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("Feed");

  const handleLogin = () => {
    if (screen === "Login" && username && email) {
      setScreen("Password");
    } else if (screen === "Password" && password) {
      setScreen("Dashboard");
    }
  };

  return (
    <View style={styles.container}>
      {/* Login Screen */}
      {screen === "Login" && (
        <View style={styles.centeredView}>
          <Icon name="leaf-outline" size={100} color="#4CAF50" />
          <Text style={styles.title}>Welcome to Go Green</Text>
          <Text style={styles.subtitle}>Join us in making a difference!</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Password Screen */}
      {screen === "Password" && (
        <View style={styles.centeredView}>
          <Icon name="lock-closed-outline" size={80} color="#4CAF50" />
          <Text style={styles.title}>Secure Login</Text>
          <Text style={styles.subtitle}>Your details are safe with us.</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Dashboard */}
      {screen === "Dashboard" && (
        <View style={styles.dashboard}>
          {/* Active Tab Content */}
          {activeTab === "Feed" && (
            <View>
              <Text style={styles.title}>
                <Icon name="newspaper-outline" size={20} /> Feed
              </Text>
              <FlatList
                data={[
                  { id: "1", message: "🌿 Join our eco-friendly movement!" },
                  { id: "2", message: "🌳 Plant a tree today, grow hope tomorrow." },
                  { id: "3", message: "♻️ Reduce, Reuse, Recycle for a better planet." },
                ]}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Text style={styles.feedMessage}>{item.message}</Text>
                )}
              />
            </View>
          )}
          {activeTab === "Messaging" && (
            <View style={styles.messagingContainer}>
              <Text style={styles.title}>
                <Icon name="chatbubble-ellipses-outline" size={20} /> Messaging
              </Text>
              <Text style={styles.emptyMessage}>
                <Icon name="mail-outline" size={20} /> Start a conversation to
                share your green ideas!
              </Text>
            </View>
          )}
          {activeTab === "Profile" && (
            <View style={styles.profileContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {username.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.profileText}>
                <Icon name="person-outline" size={20} /> Name: {username || "User"}
              </Text>
              <Text style={styles.profileText}>
                <Icon name="mail-outline" size={20} /> Email: {email}
              </Text>
              <Text style={styles.motto}>🌍 Let's Go Green Together!</Text>
            </View>
          )}

          {/* Tab Bar */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={activeTab === "Feed" ? styles.activeTab : styles.tab}
              onPress={() => setActiveTab("Feed")}
            >
              <Icon
                name="newspaper-outline"
                size={24}
                color={activeTab === "Feed" ? "#4CAF50" : "#aaa"}
              />
              <Text style={styles.tabText}>Feed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={activeTab === "Messaging" ? styles.activeTab : styles.tab}
              onPress={() => setActiveTab("Messaging")}
            >
              <Icon
                name="chatbubble-outline"
                size={24}
                color={activeTab === "Messaging" ? "#4CAF50" : "#aaa"}
              />
              <Text style={styles.tabText}>Messaging</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={activeTab === "Profile" ? styles.activeTab : styles.tab}
              onPress={() => setActiveTab("Profile")}
            >
              <Icon
                name="person-outline"
                size={24}
                color={activeTab === "Profile" ? "#4CAF50" : "#aaa"}
              />
              <Text style={styles.tabText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f8f4" },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 10, color: "#2e7d32" },
  subtitle: { fontSize: 16, color: "#4CAF50", marginBottom: 20, textAlign: "center" },
  input: {
    width: "100%",
    padding: 12,
    borderColor: "#a5d6a7",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  dashboard: { flex: 1, padding: 20 },
  feedMessage: { fontSize: 16, marginBottom: 10, color: "#388e3c" },
  emptyMessage: { fontSize: 16, color: "#999", textAlign: "center", marginTop: 20 },
  profileContainer: { alignItems: "center", marginTop: 20 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#a5d6a7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  avatarText: { fontSize: 36, color: "#fff", fontWeight: "700" },
  profileText: { fontSize: 18, color: "#2e7d32", marginBottom: 10 },
  motto: { fontSize: 16, color: "#388e3c", marginTop: 10 },
  messagingContainer: { alignItems: "center", marginTop: 50 },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#e8f5e9",
    borderTopWidth: 1,
    borderTopColor: "#a5d6a7",
    paddingVertical: 10,
  },
  tab: { alignItems: "center", padding: 10 },
  activeTab: { alignItems: "center", padding: 10, borderBottomWidth: 2, borderBottomColor: "#4CAF50" },
  tabText: { fontSize: 12, marginTop: 4, color: "#4CAF50" },
});

export default App;
