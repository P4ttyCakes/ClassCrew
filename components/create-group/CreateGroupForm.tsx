import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { db } from '../../src/config/firebase';
import { getEmojiForSubject } from '../../src/constants/subjects';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

const ACCENT = 'rgb(91, 134, 197)';

export function Dropdown({ label, value, onSelect, options, placeholder }: { label: string; value: string; onSelect: (v: string) => void; options: string[]; placeholder?: string; }) {
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

export const SUBJECT_OPTIONS = [
  'ECON','MATH','EECS','ENGR','SI','ROB','IOE','MECHENG','AEROSP','BME','CEE','NERS','MSE','CHE',
  'STATS','PHYSICS','CHEM','ASTRO','EARTH','ACC','FIN','BA','STRATEGY','PSYCH','POLSCI','SOC','COMM',
  'ORGSTUD','PUBPOL','BIOLOGY','MCDB','EEB','PHARMSCI','EPID','NURS','ENGLISH','HIST','PHIL','RCHUMS',
  'ARTDES','MUSICOL','DANCE','ASIANLAN','MEMS','CLARCH'
];

const SUBJECT_OPTIONS_WITH_EMOJI = (SUBJECT_OPTIONS as string[]).map((s) => `${s} ${getEmojiForSubject(s)}`);

// Mood options with emojis
const MOOD_KEYS = ['focused','casual','exam_prep','project','review','homework'] as const;
const MOOD_DISPLAY: Record<(typeof MOOD_KEYS)[number], string> = {
  focused: 'Focused',
  casual: 'Casual',
  exam_prep: 'Exam Prep',
  project: 'Project',
  review: 'Review',
  homework: 'Homework',
};
const MOOD_EMOJI: Record<(typeof MOOD_KEYS)[number], string> = {
  focused: '📚',
  casual: '☕',
  exam_prep: '🎯',
  project: '👥',
  review: '📝',
  homework: '✏️',
};
const MOOD_OPTIONS_WITH_EMOJI = MOOD_KEYS.map((k) => `${MOOD_DISPLAY[k]} ${MOOD_EMOJI[k]}`);

export default function CreateGroupForm({ onClose }: { onClose?: () => void }) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [course, setCourse] = useState('');
  const [time, setTime] = useState('');
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
    if (!subject.trim()) { setError('Please select a subject'); return; }
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
        coordinates: [-83.7382, 42.2780] as [number, number],
        status: 'active',
        createdAt: serverTimestamp(),
        startTime: serverTimestamp(),
        endTime: serverTimestamp(),
      };
      await addDoc(collection(db, 'studyGroups'), docData);
      setSuccess('Study group created!');
      setTitle(''); setSubject(''); setCourse(''); setTime(''); setLocation(''); setMood('focused'); setDescription('');
      onClose && onClose();
    } catch (e: any) {
      setError(e?.message || 'Failed to create study group');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemedView style={styles.formContainer}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ThemedText type="title" style={styles.screenTitle}>Create Study Group</ThemedText>
        <Field label="Title" value={title} onChangeText={setTitle} placeholder="EECS 280 Study Session" />
        <Dropdown
          label="Subject"
          value={subject ? `${subject} ${getEmojiForSubject(subject)}` : ''}
          placeholder="Select a subject"
          options={SUBJECT_OPTIONS_WITH_EMOJI}
          onSelect={(v) => setSubject(v.split(' ')[0])}
        />
        <Field label="Class" value={course} onChangeText={setCourse} placeholder="EECS 280" />
        <Field label="Time" value={time} onChangeText={setTime} placeholder="3:00 PM - 5:00 PM" />
        <Field label="Location" value={location} onChangeText={setLocation} placeholder="BBB, Mason Hall, ..." />
        <Dropdown
          label="Mood"
          value={mood ? `${MOOD_DISPLAY[mood as keyof typeof MOOD_DISPLAY]} ${MOOD_EMOJI[mood as keyof typeof MOOD_EMOJI]}` : ''}
          placeholder="Select mood"
          options={MOOD_OPTIONS_WITH_EMOJI}
          onSelect={(v) => {
            // v is like "Focused 📚" → map back to key
            const picked = MOOD_KEYS.find(k => v.startsWith(MOOD_DISPLAY[k]));
            setMood(picked || 'focused');
          }}
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

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 14,
  },
  screenTitle: { marginBottom: 8 },
  field: { gap: 6 },
  fieldLabel: { fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  button: { marginTop: 10, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  error: { textAlign: 'center' },
  success: { textAlign: 'center' },
  select: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dropdownPanel: { borderWidth: 1, borderRadius: 10, marginTop: 6, overflow: 'hidden' },
  dropdownItem: { paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(0,0,0,0.08)' },
});


