import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

// Validation functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength < 2) return { text: "Weak", color: "#ff4444" };
  if (strength < 4) return { text: "Medium", color: "#ffbb33" };
  return { text: "Strong", color: "#00C851" };
};

// Main App Component
const App = () => {
  const [screen, setScreen] = useState("Login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("Feed");
  const [emailError, setEmailError] = useState("");
  const [isResetPassword, setIsResetPassword] = useState(false);

  const handleLogin = () => {
    if (screen === "Login") {
      if (!username.trim()) {
        Alert.alert("Error", "Please enter a username");
        return;
      }
      if (!email.trim()) {
        Alert.alert("Error", "Please enter an email");
        return;
      }
      if (!isValidEmail(email)) {
        setEmailError("Please enter a valid email address");
        return;
      }
      setEmailError("");
      setScreen("Password");
    } else if (screen === "Password") {
      const passwordStrength = getPasswordStrength(password);
      if (passwordStrength.text === "Weak") {
        Alert.alert(
          "Weak Password",
          "Please use a stronger password with at least 8 characters, including uppercase, lowercase, numbers, and special characters"
        );
        return;
      }
      setScreen("Dashboard");
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim() || !isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address first");
      return;
    }
    Alert.alert(
      "Reset Password",
      `Password reset link will be sent to ${email}`,
      [
        {
          text: "OK",
          onPress: () => setIsResetPassword(false),
        },
      ]
    );
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
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder="Email Address"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError("");
            }}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
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
          {password && (
            <Text
              style={[
                styles.passwordStrength,
                { color: getPasswordStrength(password).color },
              ]}
            >
              Password Strength: {getPasswordStrength(password).text}
            </Text>
          )}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Dashboard - Only accessible after successful validation */}
      {screen === "Dashboard" && (
        <View style={styles.dashboard}>
          {/* Active Tab Content */}
          <View style={styles.content}>
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
          </View>

          {/* Tab Bar - Positioned at the bottom */}
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

// Enhanced Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8f4", // Light greenish background for the entire app
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff", // Pure white for login/password screens
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    color: "#2e7d32", // Consistent green theme for titles
  },
  subtitle: {
    fontSize: 16,
    color: "#4CAF50",
    marginBottom: 20,
    textAlign: "center",
  },
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
  inputError: {
    borderColor: "#ff4444",
    borderWidth: 1,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  passwordStrength: {
    fontSize: 14,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPassword: {
    marginTop: 15,
  },
  forgotPasswordText: {
    color: "#4CAF50",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  dashboard: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f8f4",
    justifyContent: "space-between", // This makes sure content is spread out and the tab bar stays at the bottom
  },
  content: {
    flex: 1,
  },
  feedMessage: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#e8f5e9",
  },
  messagingContainer: {
    marginTop: 20,
    padding: 10,
  },
  emptyMessage: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  profileContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  avatar: {
    backgroundColor: "#4CAF50",
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
  },
  profileText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  motto: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#4CAF50",
    marginTop: 20,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  tab: {
    alignItems: "center",
  },
  activeTab: {
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#4CAF50",
  },
  tabText: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 5,
  },
});

export default App;
