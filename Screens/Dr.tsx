import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import type { Screen } from "../types";

interface Item {
  id: number;
  name: string;
  price: number;
  glbUri: string;
}

interface ShopfurScreenProps {
  category: "DiningChair" | "Cabinet" | "DiningTable";
  goToScreen: (screen: Screen, params?: any) => void;
  addToCart: (item: { id: number; name: string; price: number }) => void;
}

const mockItems: Record<string, Item[]> = {
  DiningChair: [
    {
      id: 1,
      name: "Modern Dining Chair",
      price: 1500,
      glbUri: "https://modelviewer.dev/shared-assets/models/Chair.glb",
    },
    {
      id: 2,
      name: "Old Dining Chair",
      price: 1800,
      glbUri: "https://modelviewer.dev/shared-assets/models/Chair.glb",
    },
  ],
  Cabinet: [
    {
      id: 3,
      name: "Leather Cabinet",
      price: 7500,
      glbUri: "https://modelviewer.dev/shared-assets/models/Sofa.glb",
    },
    {
      id: 4,
      name: "Sectional Cabinet",
      price: 8999,
      glbUri: "https://modelviewer.dev/shared-assets/models/Sofa.glb",
    },
  ],
  DiningTable: [
    {
      id: 5,
      name: "Classic Dining Table",
      price: 3200,
      glbUri: "https://modelviewer.dev/shared-assets/models/Shoe.glb",
    },
    {
      id: 6,
      name: "Vintage Dining Table",
      price: 2800,
      glbUri: "https://modelviewer.dev/shared-assets/models/Shoe.glb",
    },
  ],
};

const categoryTitles = {
  DiningChair: "DiningChair",
  Cabinet: "Cabinet",
  DiningTable: "DiningTable",
};

const DRScreen: React.FC<ShopfurScreenProps> = ({
  category,
  goToScreen,
  addToCart,
}) => {
  const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);
  const [showFilters, setShowFilters] = React.useState(false);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc" | null>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [isRegistering, setIsRegistering] = React.useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");

  // Register form
  const [regUsername, setRegUsername] = React.useState("");
  const [regEmail, setRegEmail] = React.useState("");
  const [regPassword, setRegPassword] = React.useState("");
  const [regConfirmPassword, setRegConfirmPassword] = React.useState("");

  const validatePassword = (pass: string) => ({
    length: pass.length >= 8,
    uppercase: /[A-Z]/.test(pass),
    lowercase: /[a-z]/.test(pass),
    number: /\d/.test(pass),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
  });

  const getPasswordRuleText = (key: string) => {
    switch (key) {
      case "length":
        return "8+ characters";
      case "uppercase":
        return "Uppercase letter";
      case "lowercase":
        return "Lowercase letter";
      case "number":
        return "Number";
      case "special":
        return "Special character";
      default:
        return "";
    }
  };

  const passwordChecks = validatePassword(regPassword);
  const hasStartedTyping: boolean = regPassword.length > 0;
  const incompleteRules: [string, boolean][] = Object.entries(
    passwordChecks
  ).filter(([_, ok]) => !ok);

  React.useEffect(() => {
    if (!isRegistering) {
      setRegUsername("");
      setRegEmail("");
      setRegPassword("");
      setRegConfirmPassword("");
    } else {
      setLoginEmail("");
      setLoginPassword("");
    }
  }, [isRegistering]);

  const toggleFilters = () => setShowFilters(!showFilters);
  let items = [...mockItems[category]];
  if (sortOrder === "asc") items.sort((a, b) => a.price - b.price);
  else if (sortOrder === "desc") items.sort((a, b) => b.price - a.price);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>☰</Text>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/cart_icon.png")}
            style={styles.logo}
          />
          <Text style={styles.logoText}>SHOPFUR</Text>
        </View>
        <Text style={styles.headerIcon}>⚙️</Text>
      </View>

      {selectedItem ? (
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>
            Living Room | {categoryTitles[category]}
          </Text>
          <View style={styles.itemDetailCard}>
            <Image
              source={require("../assets/cart_icon.png")}
              style={{ width: 50, height: 50 }}
            />
            <Text style={styles.itemName}>{selectedItem.name}</Text>
            <Text style={styles.itemPrice}>₱ {selectedItem.price}</Text>

            <View style={styles.detailButtons}>
              <TouchableOpacity
                style={styles.cartButton}
                onPress={() => setShowModal(true)}
              >
                <Text style={styles.cartButtonText}>Add to Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.arButton}
                onPress={() => goToScreen("ar", { uri: selectedItem.glbUri })}
              >
                <Text style={styles.arButtonText}>AR VIEW</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Living Room | {categoryTitles[category]}
          </Text>

          <View style={styles.filterRow}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={toggleFilters}
            >
              <Text style={styles.filterButtonText}>☰ Filters</Text>
            </TouchableOpacity>
            <Text style={styles.clearText} onPress={() => setSortOrder(null)}>
              Clear Filters
            </Text>
          </View>

          {showFilters && (
            <View style={styles.filterPanel}>
              <Text style={styles.filterCategory}>Sort by Price:</Text>
              <View style={styles.filterOptionRow}>
                <TouchableOpacity
                  style={styles.filterOption}
                  onPress={() => setSortOrder("asc")}
                >
                  <Text style={styles.filterOptionText}>Low to High</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.filterOption}
                  onPress={() => setSortOrder("desc")}
                >
                  <Text style={styles.filterOptionText}>High to Low</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}

      {!selectedItem && (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemBox}
              onPress={() => setSelectedItem(item)}
            >
              <View style={styles.itemImagePlaceholder} />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₱ {item.price}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <BottomNav onNavigate={goToScreen} />

      <Modal animationType="slide" transparent={true} visible={showModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>
                {isRegistering ? "Register" : "Login"}
              </Text>

              {isRegistering ? (
                <>
                  <TextInput
                    placeholder="Username"
                    placeholderTextColor="#aaa"
                    style={styles.input}
                    value={regUsername}
                    onChangeText={setRegUsername}
                  />
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    style={styles.input}
                    value={regEmail}
                    onChangeText={setRegEmail}
                  />
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    style={styles.input}
                    secureTextEntry
                    value={regPassword}
                    onChangeText={setRegPassword}
                  />
                  <TextInput
                    placeholder="Confirm Password"
                    placeholderTextColor="#aaa"
                    style={styles.input}
                    secureTextEntry
                    value={regConfirmPassword}
                    onChangeText={setRegConfirmPassword}
                  />

                  {hasStartedTyping && incompleteRules.length > 0 && (
                    <View style={styles.passHintBox}>
                      {incompleteRules.map(([key]) => (
                        <Text key={key} style={styles.passHintText}>
                          • {getPasswordRuleText(key)}
                        </Text>
                      ))}
                    </View>
                  )}

                  <TouchableOpacity style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Register</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TextInput
                    placeholder="Email or Username"
                    placeholderTextColor="#aaa"
                    style={styles.input}
                    value={loginEmail}
                    onChangeText={setLoginEmail}
                  />
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    style={styles.input}
                    secureTextEntry
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                  />
                  <TouchableOpacity>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Login</Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                onPress={() => setIsRegistering(!isRegistering)}
              >
                <Text style={styles.registerToggleText}>
                  {isRegistering
                    ? "Already have an account? Login"
                    : "Don't have an account? Register"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.forgotText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const BottomNav = ({
  onNavigate,
}: {
  onNavigate: (screen: Screen, params?: any) => void;
}) => {
  const navItems: { icon: string; label: string; target: Screen }[] = [
    { icon: "🏠", label: "Home", target: "home" },
    { icon: "📥", label: "Inbox", target: "cart" },
    { icon: "🛒", label: "Cart", target: "cart" },
    { icon: "👤", label: "Profile", target: "cart" },
  ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.navItem}
          onPress={() => onNavigate(item.target)}
        >
          <Text style={styles.navIcon}>{item.icon}</Text>
          <Text style={styles.navLabel}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
  },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 16 },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#BFA890",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  registerToggleText: {
    color: "#6B4F3B",
    marginTop: 10,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  forgotText: { color: "#6B4F3B", marginTop: 10, textAlign: "center" },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#3E2E22",
    paddingVertical: 10,
  },
  navItem: { alignItems: "center" },
  navIcon: { color: "white", fontSize: 22 },
  navLabel: { color: "white", fontSize: 12, marginTop: 2 },
  container: { flex: 1, backgroundColor: "#D8C5B4" },
  header: {
    backgroundColor: "#3E2E22",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerIcon: { color: "white", fontSize: 22 },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  logo: { width: 30, height: 30, marginRight: 6 },
  logoText: { color: "white", fontWeight: "bold", fontSize: 16 },
  sectionHeader: { padding: 16 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3E2E22",
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  filterButton: {
    borderColor: "#3E2E22",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterButtonText: { color: "#3E2E22", fontWeight: "600" },
  clearText: {
    color: "#94775A",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  filterPanel: {
    backgroundColor: "#EBDDCB",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  filterCategory: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 4,
    color: "#3E2E22",
  },
  filterOptionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  filterOption: {
    backgroundColor: "#D8C5B4",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  filterOptionText: {
    color: "#3E2E22",
    fontWeight: "600",
  },
  grid: { paddingHorizontal: 16 },
  itemBox: {
    width: "47%",
    backgroundColor: "#EBDDCB",
    padding: 12,
    borderRadius: 10,
    margin: 6,
  },
  itemImagePlaceholder: {
    height: 80,
    backgroundColor: "#D8C5B4",
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: { fontWeight: "600", color: "#3E2E22" },
  itemPrice: { color: "#6B4F3B" },
  detailsContainer: {
    padding: 20,
    flex: 1,
    alignItems: "center",
  },
  itemDetailCard: {
    backgroundColor: "#EBDDCB",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  detailButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  cartButton: {
    backgroundColor: "#BFA890",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cartButtonText: {
    color: "#3E2E22",
    fontWeight: "600",
  },
  arButton: {
    backgroundColor: "#D8C5B4",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  arButtonText: {
    color: "#3E2E22",
    fontWeight: "600",
  },
  passHintBox: {
    marginBottom: 10,
    marginTop: -5,
    paddingLeft: 5,
  },
  passHintText: {
    fontSize: 12,
    color: "red",
    marginBottom: 2,
  },
});

export default DRScreen;
