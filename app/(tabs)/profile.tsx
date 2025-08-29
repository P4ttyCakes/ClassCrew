import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { fetchUserProfile, saveUserProfile, uploadProfileImage } from '../../src/utils/profile';

const MOCK_USER = {
  name: 'John Doe',
  major: 'Computer Science',
  year: 'Junior',
  profilePic: 'https://picsum.photos/200',
  classes: [
    { id: '1', name: 'Data Structures', code: 'CS 261' },
    { id: '2', name: 'Algorithms', code: 'CS 325' },
    { id: '3', name: 'Operating Systems', code: 'CS 344' },
  ],
  studyHistory: [
    {
      id: '1',
      name: 'Algorithm Analysis Study Group',
      date: '2024-03-15',
      duration: '2h',
      participants: 4,
    },
    {
      id: '2',
      name: 'OS Project Discussion',
      date: '2024-03-12',
      duration: '1.5h',
      participants: 3,
    },
    {
      id: '3',
      name: 'Data Structures Review',
      date: '2024-03-10',
      duration: '2.5h',
      participants: 5,
    },
  ],
};

const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  return (
    <View style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>{title}</ThemedText>
      {children}
    </View>
  );
};

const ClassItem = ({ name, code }: { name: string; code: string }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  return (
    <ThemedView style={[styles.itemContainer, { backgroundColor: colors.cardBackground }]}>
      <Ionicons name="book-outline" size={24} color={colors.tint} />
      <View style={styles.itemTextContainer}>
        <ThemedText style={styles.itemTitle}>{name}</ThemedText>
        <ThemedText style={[styles.itemSubtitle, { color: colors.icon }]}>{code}</ThemedText>
      </View>
    </ThemedView>
  );
};

const HistoryItem = ({ name, date, duration, participants }: {
  name: string;
  date: string;
  duration: string;
  participants: number;
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  return (
    <ThemedView style={[styles.itemContainer, { backgroundColor: colors.cardBackground }]}>
      <Ionicons name="people-outline" size={24} color={colors.tint} />
      <View style={styles.itemTextContainer}>
        <ThemedText style={styles.itemTitle}>{name}</ThemedText>
        <ThemedText style={[styles.itemSubtitle, { color: colors.icon }]}>
          {new Date(date).toLocaleDateString()} • {duration} • {participants} participants
        </ThemedText>
      </View>
    </ThemedView>
  );
};

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [profilePic, setProfilePic] = useState<string>('');
  const [classList, setClassList] = useState<string[]>([]);
  const [classInput, setClassInput] = useState<string>('');
  const [adding, setAdding] = useState<boolean>(false);
  const classInputRef = useRef<TextInput>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const auth = getAuth();
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const data = await fetchUserProfile(uid);
        if (data) {
          setDisplayName(data.displayName || '');
          setProfilePic(data.profilePicture || '');
          setClassList(Array.isArray(data.classes) ? data.classes : []);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handlePickImage = async () => {
    setErrorMsg('');
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        const file = (input.files && input.files[0]) as File | undefined;
        if (!file) return;
        const auth = getAuth();
        const uid = auth.currentUser?.uid;
        if (!uid) {
          setErrorMsg('Not signed in');
          return;
        }
        setSaving(true);
        try {
          const url = await uploadProfileImage(uid, file);
          setProfilePic(url);
        } catch (e: any) {
          console.error('Upload error (web):', e);
          setErrorMsg(e?.message || 'Failed to upload image.');
        } finally {
          setSaving(false);
        }
      };
      input.click();
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.9,
        });
        if (result.canceled) {
          return;
        }
        const asset = result.assets[0];
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        const auth = getAuth();
        const uid = auth.currentUser?.uid;
        if (!uid) {
          setErrorMsg('Not signed in');
          return;
        }
        setSaving(true);
        const url = await uploadProfileImage(uid, blob);
        setProfilePic(url);
      } catch (e: any) {
        console.error('Upload error (native):', e);
        setErrorMsg(e?.message || 'Failed to upload image.');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSave = async () => {
    const auth = getAuth();
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    setErrorMsg('');
    setSaving(true);
    try {
      await saveUserProfile(uid, {
        displayName: displayName.trim(),
        profilePicture: profilePic || undefined,
        classes: classList
      });
    } catch (e: any) {
      console.error('Save profile error:', e);
      setErrorMsg(e?.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
          ) : (
            <View style={[styles.profilePic, { backgroundColor: colors.cardBackground, alignItems: 'center', justifyContent: 'center' }]}>
              <Ionicons name="person" size={48} color={colors.icon} />
            </View>
          )}
          <Pressable onPress={handlePickImage} style={{ marginTop: 8 }}>
            <ThemedText style={{ color: colors.tint }}>Change Photo</ThemedText>
          </Pressable>
          <View style={styles.userInfo}>
            <TextInput
              style={[styles.nameInput, { color: colors.text, borderColor: colors.border }]}
              placeholder="Display name"
              placeholderTextColor={colors.icon}
              value={displayName}
              onChangeText={setDisplayName}
            />
          </View>
        </View>

        <ProfileSection title="Your Classes">
          <View style={styles.tagsContainer}>
            {classList.map((c, idx) => (
              <View key={`${c}-${idx}`} style={[styles.tag, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}> 
                <ThemedText style={styles.tagText}>{c}</ThemedText>
                <Pressable onPress={() => setClassList(prev => prev.filter((_, i) => i !== idx))} style={styles.tagRemove}>
                  <Ionicons name="close" size={14} color={colors.icon} />
                </Pressable>
              </View>
            ))}
            {adding ? (
              <View style={[styles.tag, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}> 
                <TextInput
                  ref={classInputRef}
                  style={[styles.tagInlineInput, { color: colors.text }]}
                  placeholder="EECS 280"
                  placeholderTextColor={colors.icon}
                  value={classInput}
                  onChangeText={setClassInput}
                  autoFocus
                  onBlur={() => {
                    // If nothing entered, cancel
                    if (!classInput.trim()) {
                      setAdding(false);
                    }
                  }}
                  onSubmitEditing={() => {
                    const v = classInput.trim();
                    if (!v) return;
                    setClassList(prev => (prev.includes(v) ? prev : [...prev, v]));
                    setClassInput('');
                    setAdding(false);
                  }}
                  returnKeyType="done"
                />
              </View>
            ) : (
              <Pressable onPress={() => { setAdding(true); setTimeout(() => classInputRef.current?.focus(), 0); }} style={[styles.tag, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}> 
                <Ionicons name="add" size={16} color={colors.tint} />
                <ThemedText style={[styles.tagText, { color: colors.tint }]}>Add</ThemedText>
              </Pressable>
            )}
          </View>
        </ProfileSection>
        {errorMsg ? (
          <View style={{ paddingHorizontal: 20 }}>
            <ThemedText style={[styles.errorText, { textAlign: 'center' }]}>{errorMsg}</ThemedText>
          </View>
        ) : null}

        <View style={{ padding: 20 }}>
          <Pressable
            onPress={handleSave}
            disabled={saving}
            style={{
              backgroundColor: colors.tint,
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: 'center'
            }}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Save</ThemedText>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  userInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    borderBottomWidth: 1,
    paddingVertical: 4,
    minWidth: 200,
    textAlign: 'center',
  },
  details: {
    fontSize: 16,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
  },
  classesInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
  },
  errorText: {
    color: '#EF4444',
    marginTop: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  tagRemove: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tagTextInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  tagInlineInput: {
    minWidth: 80,
    paddingVertical: 2,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  }
}); 