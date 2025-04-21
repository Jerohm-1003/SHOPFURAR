import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from "react-native";
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
} from "react-native-image-picker";
import type { Screen } from "../types"; // Adjust if needed

interface ProfileProps {
  goToScreen?: (screen: Screen) => void; // Adjust according to your types
  goBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ goToScreen, goBack }) => {
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [editAddressVisible, setEditAddressVisible] = useState(false);
  const [username, setUsername] = useState("Username");
  const [address, setAddress] = useState("123 Street Name, City, Country");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isPicModalVisible, setIsPicModalVisible] = useState(false); // Modal visibility for pic options

  // Function to open image picker for choosing profile picture
  const chooseProfilePic = () => {
    launchImageLibrary(
      { mediaType: "photo", quality: 1 },
      (response: ImagePickerResponse) => {
        if (response.assets && response.assets[0]) {
          setProfilePic(response.assets[0].uri ?? null); // Ensure uri is valid or fallback to null
        }
      }
    );
  };

  // Function to open camera for taking a new profile picture
  const takeProfilePic = () => {
    launchCamera(
      { mediaType: "photo", quality: 1 },
      (response: ImagePickerResponse) => {
        if (response.assets && response.assets[0]) {
          setProfilePic(response.assets[0].uri ?? null); // Ensure uri is valid or fallback to null
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Image
          source={require("../assets/cart_icon.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.headerIcon}>⚙️</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>My Profile</Text>

        <View style={styles.profileBox}>
          <TouchableOpacity
            style={styles.profileImagePlaceholder}
            onPress={() => setIsPicModalVisible(true)} // Show pic options modal when clicked
          >
            {profilePic ? (
              <Image source={{ uri: profilePic }} style={styles.profileImage} />
            ) : (
              <Text style={styles.profileInitial}>{username.charAt(0)}</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.profileName}>{username}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditProfileVisible(true)}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => goToScreen?.("lreg")}
          >
            <Text style={styles.actionText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => goToScreen?.("lreg")}
          >
            <Text style={styles.actionText}>Register</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileDetails}>
          <Text style={styles.detailLabel}>Address</Text>
          <Text style={styles.detailValue}>{address}</Text>

          <TouchableOpacity
            style={styles.editAddressButton}
            onPress={() => setEditAddressVisible(true)}
          >
            <Text style={styles.editAddressText}>Edit Address</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomNav}>
        {["home", "inbox", "cart", "profile"].map((target, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => goToScreen?.(target as Screen)}
          >
            <Text style={styles.navIcon}>
              {["🏠", "📥", "🛒", "👤"][index]}
            </Text>
            <Text style={styles.navLabel}>
              {["Home", "Inbox", "Cart", "Profile"][index]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal for Upload Pic and Take Photo */}
      <Modal
        visible={isPicModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPicModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Choose Profile Picture</Text>
            <TouchableOpacity
              style={styles.uploadPicButton}
              onPress={chooseProfilePic} // Opens gallery
            >
              <Text style={styles.uploadPicText}>Upload Pic</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.uploadPicButton}
              onPress={takeProfilePic} // Opens camera
            >
              <Text style={styles.uploadPicText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsPicModalVisible(false)} // Close modal
              style={styles.modalButtonCancel}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={editProfileVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditProfileVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter new username"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setEditProfileVisible(false)}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setEditProfileVisible(false)}
                style={styles.modalButtonCancel}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={editAddressVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditAddressVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Address</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter new address"
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setEditAddressVisible(false)}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setEditAddressVisible(false)}
                style={styles.modalButtonCancel}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D8C5B4", // soft cream background
  },
  header: {
    backgroundColor: "#3E2E22",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerIcon: {
    color: "white",
    fontSize: 24,
  },
  logoImage: {
    width: 100,
    height: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#3E2E22",
    marginBottom: 20,
  },
  profileBox: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#D6C7B0",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  profileInitial: {
    fontSize: 40,
    color: "#fff",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3E2E22",
    marginTop: 10,
  },
  editButton: {
    marginTop: 10,
  },
  editButtonText: {
    fontSize: 16,
    color: "#A67B5B", // button accent
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  actionButton: {
    padding: 10,
    backgroundColor: "#D6C7B0",
    borderRadius: 8,
  },
  actionText: {
    fontSize: 16,
    color: "#3E2E22",
  },
  profileDetails: {
    marginTop: 20,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3E2E22",
  },
  detailValue: {
    fontSize: 14,
    marginBottom: 10,
    color: "#6B4F3B",
  },
  editAddressButton: {
    marginBottom: 10,
  },
  editAddressText: {
    fontSize: 16,
    color: "#A67B5B",
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#A67B5B",
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  bottomNav: {
    backgroundColor: "#3E2E22",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  navItem: { alignItems: "center" },
  navIcon: { color: "white", fontSize: 22 },
  navLabel: { color: "white", fontSize: 12, marginTop: 2 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#3E2E22",
  },
  uploadPicButton: {
    padding: 10,
    backgroundColor: "#D6C7B0",
    borderRadius: 6,
    marginTop: 10,
  },
  uploadPicText: {
    textAlign: "center",
    color: "#3E2E22",
  },
  modalButtonCancel: {
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
    backgroundColor: "#A67B5B",
    marginRight: 5,
  },
  modalCancelText: {
    textAlign: "center",
    color: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#A67B5B",
    padding: 10,
    borderRadius: 6,
    marginRight: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D6C7B0",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    color: "#3E2E22",
  },
});
