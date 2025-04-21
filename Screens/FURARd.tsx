import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
} from "react-native";
import type { Screen } from "../types";

interface Item {
  id: number;
  name: string;
  price: number;
  glbUri: string;
}

interface ShopfurScreenProps {
  category: "chair" | "sofa" | "tvstand";
  goToScreen: (screen: Screen, params?: any) => void;
  addToCart: (item: { id: number; name: string; price: number }) => void;
}

const mockItems: Record<string, Item[]> = {
  chair: [
    {
      id: 1,
      name: "Modern Chair",
      price: 1500,
      glbUri: "https://modelviewer.dev/shared-assets/models/Chair.glb",
    },
    {
      id: 2,
      name: "Office Chair",
      price: 1800,
      glbUri:
        "https://github.com/Jerohm-1003/glb-models/raw/refs/heads/main/untitled.glb",
    },
  ],
  sofa: [
    {
      id: 3,
      name: "Leather Sofa",
      price: 7500,
      glbUri:
        "https://github.com/Jerohm-1003/glb-models/raw/refs/heads/main/sofa.glb",
    },
    {
      id: 4,
      name: "Sectional Sofa",
      price: 8999,
      glbUri: "https://modelviewer.dev/shared-assets/models/Sofa.glb",
    },
  ],
  tvstand: [
    {
      id: 5,
      name: "Classic TV Stand",
      price: 3200,
      glbUri: "https://modelviewer.dev/shared-assets/models/Shoe.glb",
    },
    {
      id: 6,
      name: "Wall-Mount Stand",
      price: 2800,
      glbUri: "https://modelviewer.dev/shared-assets/models/Shoe.glb",
    },
  ],
};

const categoryTitles = {
  chair: "Chair",
  sofa: "Sofa",
  tvstand: "TV Stand",
};

const ShopfurScreen: React.FC<ShopfurScreenProps> = ({
  category,
  goToScreen,
  addToCart,
}) => {
  const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);
  const [showFilters, setShowFilters] = React.useState(false);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc" | null>(null);
  const [showModal, setShowModal] = useState(false);

  const toggleFilters = () => setShowFilters(!showFilters);
  let items = [...mockItems[category]];
  if (sortOrder === "asc") items.sort((a, b) => a.price - b.price);
  else if (sortOrder === "desc") items.sort((a, b) => b.price - a.price);

  const handleAddToCart = () => {
    setShowModal(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>☰</Text>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/cart_icon.png")}
            style={styles.logo}
          />
          <Text style={styles.logoText}></Text>
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
                onPress={handleAddToCart}
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

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Proceed to LOGIN?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.modalCancel}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                  goToScreen("lreg"); // navigate to lreg.tsx
                }}
                style={styles.modalConfirm}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const BottomNav = ({
  onNavigate,
}: {
  onNavigate: (screen: Screen) => void;
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

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
    fontWeight: "600",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
  },
  modalCancel: {
    backgroundColor: "#ccc",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalConfirm: {
    backgroundColor: "#6B4F3B",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ShopfurScreen;
