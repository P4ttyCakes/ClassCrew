export interface Member {
  id: string;
  name: string;
  profilePicture: string;
}

export interface StudyGroup {
  id: string;
  title: string;
  subject: 'math' | 'english' | 'science' | 'history' | 'computer' | 'business' | 'art';
  mood: 'focused' | 'casual' | 'exam_prep' | 'project' | 'review' | 'homework';
  time: string;
  location: string;
  description: string;
  memberCount: number;
  members: Member[];
  distance: string;
  coordinates: [number, number]; // [longitude, latitude]
}

// Mock profile pictures using https://i.pravatar.cc/ for demonstration
export const MOCK_MEMBERS: Member[] = [
  { id: '1', name: 'Alex', profilePicture: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Jordan', profilePicture: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Taylor', profilePicture: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'Morgan', profilePicture: 'https://i.pravatar.cc/150?img=4' },
  { id: '5', name: 'Casey', profilePicture: 'https://i.pravatar.cc/150?img=5' },
  { id: '6', name: 'Sam', profilePicture: 'https://i.pravatar.cc/150?img=6' }
];

export const STUDY_GROUPS: StudyGroup[] = [
  {
    id: '1',
    title: 'EECS 280 Study Session',
    subject: 'computer',
    mood: 'exam_prep',
    time: '3:00 PM - 5:00 PM',
    location: 'Bob and Betty Beyster Building (BBB)',
    description: 'Reviewing data structures and algorithms for the upcoming exam. Bring your laptops!',
    memberCount: 4,
    members: MOCK_MEMBERS.slice(0, 4),
    distance: '0.2 mi',
    coordinates: [-83.7174, 42.2927] // BBB coordinates
  },
  {
    id: '2',
    title: 'Organic Chemistry Review',
    subject: 'science',
    mood: 'focused',
    time: '4:30 PM - 6:30 PM',
    location: 'Chemistry Building',
    description: 'Going through reaction mechanisms and synthesis problems. Bring your molecular models!',
    memberCount: 6,
    members: MOCK_MEMBERS.slice(0, 6),
    distance: '0.3 mi',
    coordinates: [-83.7403, 42.2789] // Chemistry Building coordinates
  },
  {
    id: '3',
    title: 'Calculus II Group',
    subject: 'math',
    mood: 'homework',
    time: '2:00 PM - 4:00 PM',
    location: 'Mason Hall',
    description: 'Working on integration techniques and series problems. Bring your calculators!',
    memberCount: 5,
    members: MOCK_MEMBERS.slice(0, 5),
    distance: '0.1 mi',
    coordinates: [-83.7382, 42.2744] // Mason Hall coordinates
  },
  {
    id: '4',
    title: 'Business Strategy Project',
    subject: 'business',
    mood: 'project',
    time: '1:00 PM - 3:00 PM',
    location: 'Ross School of Business',
    description: 'Finalizing our case study presentation. Need help with market analysis slides.',
    memberCount: 4,
    members: MOCK_MEMBERS.slice(0, 4),
    distance: '0.4 mi',
    coordinates: [-83.7382, 42.2723] // Ross coordinates
  },
  {
    id: '5',
    title: 'Art History Discussion',
    subject: 'art',
    mood: 'casual',
    time: '5:00 PM - 6:30 PM',
    location: 'Michigan Union',
    description: 'Discussing Renaissance art movements over coffee. All art lovers welcome!',
    memberCount: 3,
    members: MOCK_MEMBERS.slice(0, 3),
    distance: '0.2 mi',
    coordinates: [-83.7419, 42.2744] // Michigan Union coordinates
  },
  {
    id: '6',
    title: 'English Literature Review',
    subject: 'english',
    mood: 'review',
    time: '4:00 PM - 6:00 PM',
    location: 'Shapiro Library',
    description: 'Reviewing Shakespeare\'s themes and character analysis for the midterm.',
    memberCount: 4,
    members: MOCK_MEMBERS.slice(0, 4),
    distance: '0.3 mi',
    coordinates: [-83.7382, 42.2751] // Shapiro Library coordinates
  },
  {
    id: '7',
    title: 'World History Study Group',
    subject: 'history',
    mood: 'focused',
    time: '3:30 PM - 5:30 PM',
    location: 'Tisch Hall',
    description: 'Covering the Industrial Revolution and its global impact. Bring your notes!',
    memberCount: 5,
    members: MOCK_MEMBERS.slice(0, 5),
    distance: '0.2 mi',
    coordinates: [-83.7401, 42.2747] // Tisch Hall coordinates
  }
]; 