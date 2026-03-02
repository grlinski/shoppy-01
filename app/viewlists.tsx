
//Maybe rename to lists?



import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useEntries, Entry } from "../context/EntriesContext";

export default function ResultsScreen() {
  const { entries, updateEntry, updateTitle, deleteEntry } = useEntries();
  const router = useRouter();

  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editTextValue, setEditTextValue] = useState("");
  const [editTitleValue, setEditTitleValue] = useState("");

  const handleEditText = (item: Entry) => {
    setEditingTextId(item.id);
    setEditTextValue(item.text);
  };

  const handleSaveText = (id: string) => {
    updateEntry(id, editTextValue);
    setEditingTextId(null);
  };

  const handleEditTitle = (item: Entry) => {
    setEditingTitleId(item.id);
    setEditTitleValue(item.title);
  };

  const handleSaveTitle = (id: string) => {
    updateTitle(id, editTitleValue);
    setEditingTitleId(null);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this entry?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteEntry(id) },
      ]
    );
  };

  const renderItem = ({ item }: { item: Entry }) => (
    <View style={styles.card}>
      {/* Title row */}
      <View style={styles.titleRow}>
        {editingTitleId === item.id ? (
          <TextInput
            style={styles.titleInput}
            value={editTitleValue}
            onChangeText={setEditTitleValue}
            autoFocus
            onBlur={() => handleSaveTitle(item.id)}
            onSubmitEditing={() => handleSaveTitle(item.id)}
          />
        ) : (
          <Text style={styles.title}>{item.title}</Text>
        )}
        <View style={styles.titleActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() =>
              editingTitleId === item.id
                ? handleSaveTitle(item.id)
                : handleEditTitle(item)
            }
          >
            <Text style={styles.iconButtonText}>
              {editingTitleId === item.id ? "Save" : "Edit"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Text body */}
      {editingTextId === item.id ? (
        <TextInput
          style={styles.textInput}
          value={editTextValue}
          onChangeText={setEditTextValue}
          multiline
          autoFocus
        />
      ) : (
        <Text style={styles.text}>{item.text}</Text>
      )}

      {/* Edit/Save text button */}
      <TouchableOpacity
        style={styles.editTextButton}
        onPress={() =>
          editingTextId === item.id
            ? handleSaveText(item.id)
            : handleEditText(item)
        }
      >
        <Text style={styles.editTextButtonText}>
          {editingTextId === item.id ? "Save Text" : "Edit Text"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Results</Text>
      </View>

      {entries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No entries yet. Take a picture to get started!</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 56,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 16,
  },
  back: { fontSize: 16, color: "#007AFF" },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111" },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: { fontSize: 16, fontWeight: "600", color: "#111", flex: 1 },
  titleInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    borderBottomWidth: 1,
    borderBottomColor: "#007AFF",
    paddingVertical: 2,
    color: "#111",
  },
  titleActions: { flexDirection: "row", gap: 8 },
  iconButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#e8f0fe",
  },
  iconButtonText: { color: "#007AFF", fontSize: 13, fontWeight: "500" },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#fee8e8",
  },
  deleteButtonText: { color: "#e00", fontSize: 13, fontWeight: "500" },
  text: { fontSize: 16, lineHeight: 24, color: "#333" },
  textInput: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    padding: 8,
    minHeight: 80,
  },
  editTextButton: {
    marginTop: 10,
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
  },
  editTextButtonText: { color: "#333", fontSize: 13, fontWeight: "500" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
  emptyText: { color: "#aaa", textAlign: "center", fontSize: 16 },
});