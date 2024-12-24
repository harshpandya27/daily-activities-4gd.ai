import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import axios from "axios";
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

  // Handle login
  const handleLogin = async () => {
    if (screen === "Login") {
      if (!email.trim()) {
        Alert.alert("Error", "Please enter an email");
        return;
      }
      if (!isValidEmail(email)) {
        setEmailError("Please enter a valid email address");
        return;
      }
      setEmailError("");

      // Send request to backend to check email
      try {
        const response = await axios.post("http://10.1.106.97:5000/login/email", {
          email,
        });

        if (response.status === 200) {
          setScreen("Password"); // Proceed to password screen
        } else {
          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        Alert.alert("Error", error.response?.data?.message || "Network error");
      }
    } else if (screen === "Password") {
      if (!password.trim()) {
        Alert.alert("Error", "Please enter a password");
        return;
      }

      const passwordStrength = getPasswordStrength(password);
      if (passwordStrength.text === "Weak") {
        Alert.alert(
          "Weak Password",
          "Please use a stronger password with at least 8 characters, including uppercase, lowercase, numbers, and special characters"
        );
        return;
      }

      // Send request to backend to check credentials
      try {
        const response = await axios.post("http://10.1.106.97:5000/login/password", {
          email,
          password,
        });

        if (response.status === 200) {
          setScreen("Dashboard"); // Proceed to dashboard if credentials are valid
        } else {
          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        Alert.alert("Error", error.response?.data?.message || "Network error");
      }
    }
  };

  // Handle forgot password
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
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  passwordStrength: {
    fontSize: 14,
    marginBottom: 10,
  },
  forgotPassword: {
    marginTop: 20,
  },
  forgotPasswordText: {
    color: "#007BFF",
  },
  dashboard: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  feedMessage: {
    fontSize: 16,
    marginBottom: 10,
  },
  messagingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyMessage: {
    fontSize: 18,
    textAlign: "center",
    color: "#aaa",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4CAF50",
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
    fontSize: 18,
    marginBottom: 10,
  },
  motto: {
    fontSize: 18,
    color: "#4CAF50",
    marginTop: 20,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: 10,
  },
  tab: {
    alignItems: "center",
    flex: 1,
  },
  activeTab: {
    alignItems: "center",
    flex: 1,
    borderBottomWidth: 3,
    borderBottomColor: "#4CAF50",
  },
  tabText: {
    fontSize: 12,
    color: "#aaa",
  },
});

export default App;
