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
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) => ({
    length: password.length >= 8,
    number: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password),
    upperLower: /(?=.*[a-z])(?=.*[A-Z])/.test(password),
  });

  const handleSubmit = () => {
    const reqs = validatePassword(form.password);
    const allValid = Object.values(reqs).every(Boolean);
    const emailValid = validateEmail(form.email);

    if (!emailValid) {
      Alert.alert("Error", "Invalid email format.");
      return;
    }

    if (isRegister) {
      if (!allValid) {
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

  const passwordReqs = validatePassword(form.password);
  const showPasswordHints =
    isRegister &&
    passwordTouched &&
    Object.values(passwordReqs).some((v) => !v);

  const passwordsMatch =
    isRegister && form.password === form.confirm && form.confirm.length > 0;

  const confirmMismatch =
    isRegister &&
    confirmTouched &&
    form.confirm.length > 0 &&
    form.password !== form.confirm;

  const emailInvalid =
    isRegister &&
    emailTouched &&
    form.email.length > 0 &&
    !validateEmail(form.email);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => goToScreen("home")}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>←</Text>
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

      {/* Email with validation box */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onFocus={() => setEmailTouched(true)}
          onChangeText={(text) => {
            setForm({ ...form, email: text });
            if (!emailTouched) setEmailTouched(true);
          }}
        />
        {emailInvalid && (
          <View style={styles.reqsInside}>
            <Text style={styles.requirement}>
              • Must be a valid email format
            </Text>
          </View>
        )}
      </View>

      {/* Password field */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={form.password}
          onFocus={() => setPasswordTouched(true)}
          onChangeText={(text) => {
            setForm({ ...form, password: text });
            if (!passwordTouched) setPasswordTouched(true);
          }}
        />
        {showPasswordHints && (
          <View style={styles.reqsInside}>
            {Object.entries(passwordReqs).map(
              ([key, met]) =>
                !met && (
                  <Text key={key} style={styles.requirement}>
                    • Must contain{" "}
                    {key === "upperLower"
                      ? "uppercase & lowercase"
                      : key === "length"
                      ? "8+ characters"
                      : key}
                  </Text>
                )
            )}
          </View>
        )}
      </View>

      {isRegister && (
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={form.confirm}
            onFocus={() => setConfirmTouched(true)}
            onChangeText={(text) => {
              setForm({ ...form, confirm: text });
              if (!confirmTouched) setConfirmTouched(true);
            }}
          />
          {confirmMismatch && (
            <Text style={styles.confirmError}>❌ Passwords do not match</Text>
          )}
          {passwordsMatch && (
            <Text style={styles.confirmSuccess}>✅ Passwords match</Text>
          )}
        </View>
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
    backgroundColor: "#F5F5DC",
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
  passwordContainer: {
    position: "relative",
    marginBottom: 10,
  },
  reqsInside: {
    position: "absolute",
    top: "100%",
    left: 10,
    right: 10,
    backgroundColor: "#fff8f0",
    padding: 8,
    borderRadius: 8,
    borderColor: "#e0b4a1",
    borderWidth: 1,
    marginTop: 5,
    zIndex: 1,
  },
  requirement: {
    color: "red",
    fontSize: 12,
  },
  confirmError: {
    color: "red",
    fontSize: 12,
    marginTop: -5,
    marginLeft: 10,
  },
  confirmSuccess: {
    color: "green",
    fontSize: 12,
    marginTop: -5,
    marginLeft: 10,
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
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: "#1E90FF",
  },
});
