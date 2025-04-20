import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Screen } from "./App";

interface Props {
  goToScreen: (screen: Screen, params?: any) => void;
}

const LRegScreen: React.FC<Props> = ({ goToScreen }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      number: /\d/.test(password),
      special: /[!@#$%^&*]/.test(password),
      upperLower: /(?=.*[a-z])(?=.*[A-Z])/.test(password),
    };
    return requirements;
  };

  const handleSubmit = () => {
    if (isRegister) {
      const reqs = validatePassword(form.password);
      if (!reqs.length || !reqs.number || !reqs.special || !reqs.upperLower) {
        Alert.alert("Error", "Password does not meet requirements.");
        return;
      }
      if (form.password !== form.confirm) {
        Alert.alert("Error", "Passwords do not match.");
        return;
      }
      Alert.alert("Registered!", "You have been registered successfully.");
    } else {
      if (!form.email || !form.password) {
        Alert.alert("Error", "Please enter email and password.");
        return;
      }
      Alert.alert("Logged in!", "Welcome back.");
    }
    goToScreen("home");
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => goToScreen("home")}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{isRegister ? "Register" : "Login"}</Text>

      {isRegister && (
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={form.username}
          onChangeText={(text) => setForm({ ...form, username: text })}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
      />
      {isRegister && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={form.confirm}
            onChangeText={(text) => setForm({ ...form, confirm: text })}
          />
          <View style={styles.reqs}>
            {Object.entries(validatePassword(form.password)).map(([key, met]) =>
              !met ? (
                <Text key={key} style={styles.requirement}>
                  - Must contain{" "}
                  {key === "upperLower" ? "uppercase & lowercase" : key}
                </Text>
              ) : null
            )}
          </View>
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {isRegister ? "Register" : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsRegister((prev) => !prev)}>
        <Text style={styles.toggleText}>
          {isRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LRegScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    justifyContent: "center",
    backgroundColor: "#F5F5DC", // light beige like your theme
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#3E2723",
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#5D4037",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  toggleText: {
    marginTop: 15,
    textAlign: "center",
    color: "#1E90FF",
    textDecorationLine: "underline",
  },
  requirement: {
    color: "red",
    fontSize: 12,
  },
  reqs: {
    marginTop: 5,
    paddingLeft: 5,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: "#1E90FF",
    textDecorationLine: "underline",
  },
});
