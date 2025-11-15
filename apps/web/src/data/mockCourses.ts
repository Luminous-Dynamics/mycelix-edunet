/**
 * Mock course data
 */

export interface Course {
  course_id: string;
  title: string;
  description: string;
  instructor: string;
  syllabus: {
    modules: Module[];
    learning_outcomes?: string[];
    prerequisites?: string[];
  };
  tags: string[];
  difficulty: string;
  enrollment_count?: number;
  created_at?: string;
}

export interface Module {
  module_id: string;
  title: string;
  description?: string;
  duration_hours: number;
  learning_outcomes?: string[];
}

export const mockCourses: Course[] = [
  {
    course_id: 'rust-fundamentals-2025',
    title: 'Rust Fundamentals',
    description: 'Master the Rust programming language from basics to advanced concepts',
    instructor: 'Prof. Taylor Chen',
    syllabus: {
      modules: [
        {
          module_id: '1',
          title: 'Introduction to Rust',
          duration_hours: 3,
          learning_outcomes: ['Understand Rust syntax', 'Set up development environment'],
        },
        {
          module_id: '2',
          title: 'Ownership and Borrowing',
          duration_hours: 5,
          learning_outcomes: ['Master ownership rules', 'Understand borrowing and lifetimes'],
        },
        {
          module_id: '3',
          title: 'Structs and Enums',
          duration_hours: 4,
          learning_outcomes: ['Create custom data types', 'Use pattern matching'],
        },
        {
          module_id: '4',
          title: 'Error Handling',
          duration_hours: 3,
          learning_outcomes: ['Handle errors with Result', 'Use Option type effectively'],
        },
        {
          module_id: '5',
          title: 'Concurrency',
          duration_hours: 6,
          learning_outcomes: ['Write concurrent programs', 'Understand thread safety'],
        },
      ],
      prerequisites: ['Basic programming knowledge'],
    },
    tags: ['programming', 'rust', 'systems'],
    difficulty: 'intermediate',
    enrollment_count: 342,
    created_at: '2025-01-15T00:00:00Z',
  },
  {
    course_id: 'spanish-beginner-2025',
    title: 'Spanish for Beginners',
    description: 'Learn Spanish from scratch with interactive lessons',
    instructor: 'Prof. María González',
    syllabus: {
      modules: [
        {
          module_id: '1',
          title: 'Greetings and Introductions',
          duration_hours: 2,
        },
        {
          module_id: '2',
          title: 'Numbers and Colors',
          duration_hours: 2,
        },
        {
          module_id: '3',
          title: 'Family and Relationships',
          duration_hours: 3,
        },
        {
          module_id: '4',
          title: 'Present Tense Verbs',
          duration_hours: 4,
        },
      ],
    },
    tags: ['language', 'spanish', 'beginner'],
    difficulty: 'beginner',
    enrollment_count: 587,
    created_at: '2025-02-01T00:00:00Z',
  },
  {
    course_id: 'machine-learning-intro',
    title: 'Machine Learning Fundamentals',
    description: 'Introduction to ML concepts and practical applications',
    instructor: 'Dr. Sarah Kumar',
    syllabus: {
      modules: [
        {
          module_id: '1',
          title: 'What is Machine Learning?',
          duration_hours: 2,
        },
        {
          module_id: '2',
          title: 'Supervised Learning',
          duration_hours: 6,
        },
        {
          module_id: '3',
          title: 'Unsupervised Learning',
          duration_hours: 5,
        },
        {
          module_id: '4',
          title: 'Neural Networks Basics',
          duration_hours: 8,
        },
      ],
      prerequisites: ['Python programming', 'Basic statistics'],
    },
    tags: ['ai', 'ml', 'python', 'advanced'],
    difficulty: 'advanced',
    enrollment_count: 234,
    created_at: '2025-03-10T00:00:00Z',
  },
  {
    course_id: 'web3-dev',
    title: 'Web3 Development Basics',
    description: 'Build decentralized applications on blockchain',
    instructor: 'Alex Rivera',
    syllabus: {
      modules: [
        {
          module_id: '1',
          title: 'Blockchain Fundamentals',
          duration_hours: 3,
        },
        {
          module_id: '2',
          title: 'Smart Contracts',
          duration_hours: 6,
        },
        {
          module_id: '3',
          title: 'DApp Development',
          duration_hours: 8,
        },
      ],
      prerequisites: ['JavaScript', 'Basic cryptography'],
    },
    tags: ['web3', 'blockchain', 'solidity'],
    difficulty: 'intermediate',
    enrollment_count: 198,
    created_at: '2025-04-05T00:00:00Z',
  },
  {
    course_id: 'data-structures',
    title: 'Advanced Data Structures',
    description: 'Master complex data structures and algorithms',
    instructor: 'Prof. James Lee',
    syllabus: {
      modules: [
        {
          module_id: '1',
          title: 'Trees and Graphs',
          duration_hours: 5,
        },
        {
          module_id: '2',
          title: 'Hash Tables',
          duration_hours: 4,
        },
        {
          module_id: '3',
          title: 'Dynamic Programming',
          duration_hours: 6,
        },
        {
          module_id: '4',
          title: 'Advanced Algorithms',
          duration_hours: 7,
        },
      ],
      prerequisites: ['Data Structures Basics', 'Algorithm Analysis'],
    },
    tags: ['algorithms', 'programming', 'computer-science'],
    difficulty: 'advanced',
    enrollment_count: 156,
    created_at: '2025-05-20T00:00:00Z',
  },
  {
    course_id: 'cryptography',
    title: 'Applied Cryptography',
    description: 'Learn cryptographic principles and implementations',
    instructor: 'Dr. Emily Zhang',
    syllabus: {
      modules: [
        {
          module_id: '1',
          title: 'Symmetric Encryption',
          duration_hours: 4,
        },
        {
          module_id: '2',
          title: 'Public Key Cryptography',
          duration_hours: 5,
        },
        {
          module_id: '3',
          title: 'Hash Functions',
          duration_hours: 3,
        },
        {
          module_id: '4',
          title: 'Digital Signatures',
          duration_hours: 4,
        },
        {
          module_id: '5',
          title: 'Zero-Knowledge Proofs',
          duration_hours: 6,
        },
      },
      prerequisites: ['Mathematics', 'Computer Science Fundamentals'],
    },
    tags: ['cryptography', 'security', 'mathematics'],
    difficulty: 'advanced',
    enrollment_count: 89,
    created_at: '2025-06-15T00:00:00Z',
  },
];

export function getCourseById(id: string): Course | undefined {
  return mockCourses.find(c => c.course_id === id);
}

export function getCoursesByTag(tag: string): Course[] {
  return mockCourses.filter(c => c.tags.includes(tag.toLowerCase()));
}

export function getCoursesByDifficulty(difficulty: string): Course[] {
  return mockCourses.filter(c => c.difficulty === difficulty.toLowerCase());
}

export function searchCourses(query: string): Course[] {
  const lowerQuery = query.toLowerCase();
  return mockCourses.filter(
    c =>
      c.title.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.tags.some(tag => tag.includes(lowerQuery))
  );
}
