import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { db } from '../../src/config/firebase';

const ACCENT = 'rgb(91, 134, 197)';

export default function CreateGroupScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(''); // Department prefix, e.g., EECS
  const [course, setCourse] = useState(''); // Full Class, e.g., EECS 280
  const [time, setTime] = useState(''); // e.g., 3:00 PM - 5:00 PM
  const [location, setLocation] = useState('');
  const [mood, setMood] = useState('focused');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreate = async () => {
    setError('');
    setSuccess('');
    if (!title.trim()) { setError('Please enter a title'); return; }
    if (!subject.trim()) { setError('Please enter a subject (e.g., EECS)'); return; }
    if (!course.trim()) { setError('Please enter a Class (e.g., EECS 280)'); return; }
    if (!location.trim()) { setError('Please enter a location'); return; }

    const auth = getAuth();
    const uid = auth.currentUser?.uid;
    if (!uid) { setError('You must be signed in'); return; }

    setSaving(true);
    try {
      const docData = {
        title: title.trim(),
        subject: subject.trim().toUpperCase(),
        Class: course.trim(),
        mood,
        time: time.trim() || 'TBD',
        location: location.trim(),
        description: description.trim(),
        memberCount: 1,
        users: [uid],
        distance: '',
        // Default to Ann Arbor center so it appears on map (adjust later)
        coordinates: [-83.7382, 42.2780] as [number, number],
        status: 'active',
        createdAt: serverTimestamp(),
        startTime: serverTimestamp(),
        endTime: serverTimestamp(),
      };
      await addDoc(collection(db, 'studyGroups'), docData);
      setSuccess('Study group created!');
      setTitle('');
      setSubject('');
      setCourse('');
      setTime('');
      setLocation('');
      setMood('focused');
      setDescription('');
    } catch (e: any) {
      setError(e?.message || 'Failed to create study group');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ThemedText type="title" style={styles.screenTitle}>Create Study Group</ThemedText>

        <Field label="Title" value={title} onChangeText={setTitle} placeholder="EECS 280 Study Session" />
        <Dropdown
          label="Subject"
          value={subject}
          placeholder="Select a subject"
          options={SUBJECT_OPTIONS}
          onSelect={setSubject}
        />
        <Field label="Class" value={course} onChangeText={setCourse} placeholder="EECS 280" />
        <Field label="Time" value={time} onChangeText={setTime} placeholder="3:00 PM - 5:00 PM" />
        <Field label="Location" value={location} onChangeText={setLocation} placeholder="BBB, Mason Hall, ..." />
        <Dropdown
          label="Mood"
          value={mood}
          placeholder="Select mood"
          options={['focused','casual','exam_prep','project','review','homework']}
          onSelect={setMood}
        />
        <Field label="Description" value={description} onChangeText={setDescription} placeholder="What will you cover?" multiline />

        {error ? <ThemedText style={[styles.error, { color: '#EF4444' }]}>{error}</ThemedText> : null}
        {success ? <ThemedText style={[styles.success, { color: colors.tint }]}>{success}</ThemedText> : null}

        <Pressable onPress={handleCreate} disabled={saving} style={[styles.button, { backgroundColor: ACCENT, opacity: saving ? 0.7 : 1 }]}> 
          {saving ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.buttonText}>Create</ThemedText>}
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

function Field({ label, ...props }: any) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  return (
    <View style={styles.field}> 
      <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        placeholderTextColor={colors.icon}
        {...props}
      />
    </View>
  );
}

function Dropdown({ label, value, onSelect, options, placeholder }: { label: string; value: string; onSelect: (v: string) => void; options: string[]; placeholder?: string; }) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.field}>
      <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
      <Pressable
        style={[styles.select, { borderColor: colors.border }]} 
        onPress={() => setOpen(o => !o)}
      >
        <ThemedText style={{ opacity: value ? 1 : 0.6 }}>
          {value || placeholder || 'Select'}
        </ThemedText>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.icon} />
      </Pressable>
      {open && (
        <View style={[styles.dropdownPanel, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}> 
          <ScrollView style={{ maxHeight: 240 }}>
            {options.map(opt => (
              <Pressable
                key={opt}
                onPress={() => { onSelect(opt); setOpen(false); }}
                style={styles.dropdownItem}
              >
                <ThemedText>{opt}</ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const SUBJECT_OPTIONS = [
  'ECON','MATH','EECS','ENGR','SI','ROB','IOE','MECHENG','AEROSP','BME','CEE','NERS','MSE','CHE',
  'STATS','PHYSICS','CHEM','ASTRO','EARTH','ACC','FIN','BA','STRATEGY','PSYCH','POLSCI','SOC','COMM',
  'ORGSTUD','PUBPOL','BIOLOGY','MCDB','EEB','PHARMSCI','EPID','NURS','ENGLISH','HIST','PHIL','RCHUMS',
  'ARTDES','MUSICOL','DANCE','ASIANLAN','MEMS','CLARCH'
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    gap: 14,
  },
  screenTitle: {
    marginBottom: 8,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  select: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownPanel: {
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 6,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)'
  },
  button: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  error: {
    textAlign: 'center',
  },
  success: {
    textAlign: 'center',
  }
});


