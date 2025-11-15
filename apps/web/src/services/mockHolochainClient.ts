/**
 * Mock Holochain Client
 *
 * Simulates Holochain conductor connection and zome function calls for development and demo purposes.
 * Returns realistic mock data with simulated latency and occasional errors.
 */

// Import example data
import courseExample1 from '../../../../examples/courses/spanish-beginner.json';
// import courseExample2 from '../../../../examples/courses/rust-fundamentals.json';
// import flRoundActive from '../../../../examples/fl-rounds/round-002-active.json';
import flRoundCompleted from '../../../../examples/fl-rounds/round-001-completed.json';
import credentialExample from '../../../../examples/credentials/valid-achievement.json';

export interface ZomeCallParams {
  zome: string;
  fnName: string;
  payload: any;
}

export interface MockHolochainClientConfig {
  /** Minimum latency in ms */
  minLatency?: number;
  /** Maximum latency in ms */
  maxLatency?: number;
  /** Probability of error (0.0 to 1.0) */
  errorRate?: number;
  /** Enable console logging */
  verbose?: boolean;
}

const DEFAULT_CONFIG: MockHolochainClientConfig = {
  minLatency: 100,
  maxLatency: 300,
  errorRate: 0.1,
  verbose: true,
};

export class MockHolochainClient {
  private config: MockHolochainClientConfig;
  private connected: boolean = false;

  // In-memory state
  private courses: any[] = [];
  private flRounds: any[] = [];
  private credentials: any[] = [];
  private enrollments: Map<string, string[]> = new Map(); // agentId -> courseIds

  constructor(config: Partial<MockHolochainClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initializeMockData();
  }

  /**
   * Initialize mock data from examples
   */
  private initializeMockData() {
    // Load courses
    this.courses = [
      courseExample1,
      this.generateMockCourse('rust-fundamentals', 'Rust Fundamentals'),
      this.generateMockCourse('machine-learning-intro', 'Machine Learning Fundamentals'),
      this.generateMockCourse('web3-dev', 'Web3 Development Basics'),
      this.generateMockCourse('data-structures', 'Advanced Data Structures'),
      this.generateMockCourse('cryptography', 'Applied Cryptography'),
    ];

    // Load FL rounds
    this.flRounds = [
      flRoundCompleted,
      this.generateMockFlRound('fl-round-002', 'UPDATE', 8),
      this.generateMockFlRound('fl-round-003', 'DISCOVER', 0),
      this.generateMockFlRound('fl-round-004', 'JOIN', 5),
    ];

    // Load credentials
    this.credentials = [
      credentialExample,
      this.generateMockCredential('rust-fundamentals-2025'),
      this.generateMockCredential('spanish-beginner-2025'),
    ];

    if (this.config.verbose) {
      console.log('[MockHolochainClient] Initialized with mock data');
      console.log(`  - ${this.courses.length} courses`);
      console.log(`  - ${this.flRounds.length} FL rounds`);
      console.log(`  - ${this.credentials.length} credentials`);
    }
  }

  /**
   * Simulate connection to conductor
   */
  async connect(): Promise<void> {
    await this.simulateLatency();

    if (Math.random() < this.config.errorRate!) {
      throw new Error('Failed to connect to conductor');
    }

    this.connected = true;

    if (this.config.verbose) {
      console.log('[MockHolochainClient] Connected to conductor');
    }
  }

  /**
   * Disconnect from conductor
   */
  disconnect(): void {
    this.connected = false;

    if (this.config.verbose) {
      console.log('[MockHolochainClient] Disconnected from conductor');
    }
  }

  /**
   * Check connection status
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Call a zome function
   */
  async callZome(zome: string, fnName: string, payload: any = {}): Promise<any> {
    if (!this.connected) {
      throw new Error('Not connected to conductor. Call connect() first.');
    }

    await this.simulateLatency();

    // Simulate occasional errors
    if (Math.random() < this.config.errorRate!) {
      throw new Error(`Zome call failed: ${zome}::${fnName}`);
    }

    if (this.config.verbose) {
      console.log(`[MockHolochainClient] Calling ${zome}::${fnName}`, payload);
    }

    // Route to appropriate handler
    switch (zome) {
      case 'learning_zome':
        return this.handleLearningZome(fnName, payload);
      case 'fl_zome':
        return this.handleFlZome(fnName, payload);
      case 'credential_zome':
        return this.handleCredentialZome(fnName, payload);
      case 'dao_zome':
        return this.handleDaoZome(fnName, payload);
      default:
        throw new Error(`Unknown zome: ${zome}`);
    }
  }

  /**
   * Handle learning zome functions
   */
  private handleLearningZome(fnName: string, payload: any): any {
    switch (fnName) {
      case 'get_courses':
        return this.courses;

      case 'get_course':
        const course = this.courses.find(c => c.course_id === payload.course_id);
        if (!course) throw new Error('Course not found');
        return course;

      case 'create_course':
        const newCourse = { ...payload, created_at: new Date().toISOString() };
        this.courses.push(newCourse);
        return newCourse;

      case 'enroll':
        const agentId = payload.agent_id || 'mock-agent-123';
        const courseIds = this.enrollments.get(agentId) || [];
        if (!courseIds.includes(payload.course_id)) {
          courseIds.push(payload.course_id);
          this.enrollments.set(agentId, courseIds);
        }
        return { success: true, course_id: payload.course_id };

      case 'get_enrollments':
        const agentEnrollments = this.enrollments.get(payload.agent_id || 'mock-agent-123') || [];
        return agentEnrollments.map(courseId =>
          this.courses.find(c => c.course_id === courseId)
        ).filter(Boolean);

      default:
        throw new Error(`Unknown function: ${fnName}`);
    }
  }

  /**
   * Handle FL zome functions
   */
  private handleFlZome(fnName: string, payload: any): any {
    switch (fnName) {
      case 'get_rounds':
        return this.flRounds;

      case 'get_round':
        const round = this.flRounds.find(r => r.round_id === payload.round_id);
        if (!round) throw new Error('Round not found');
        return round;

      case 'create_round':
        const newRound = this.generateMockFlRound(
          payload.round_id || `fl-round-${Date.now()}`,
          'DISCOVER',
          0
        );
        this.flRounds.push(newRound);
        return newRound;

      case 'join_round':
        const joinRound = this.flRounds.find(r => r.round_id === payload.round_id);
        if (!joinRound) throw new Error('Round not found');
        joinRound.current_participants = (joinRound.current_participants || 0) + 1;
        return { success: true, round_id: payload.round_id };

      case 'submit_update':
        return { success: true, update_hash: this.generateHash() };

      default:
        throw new Error(`Unknown function: ${fnName}`);
    }
  }

  /**
   * Handle credential zome functions
   */
  private handleCredentialZome(fnName: string, payload: any): any {
    switch (fnName) {
      case 'get_credentials':
        return this.credentials;

      case 'get_credential':
        const credential = this.credentials.find(c => c.id === payload.credential_id);
        if (!credential) throw new Error('Credential not found');
        return credential;

      case 'issue_credential':
        const newCredential = this.generateMockCredential(payload.course_id);
        this.credentials.push(newCredential);
        return newCredential;

      case 'verify_credential':
        // Simulate verification
        return {
          valid: true,
          issuer: 'did:key:z6Mk...',
          verified_at: new Date().toISOString()
        };

      default:
        throw new Error(`Unknown function: ${fnName}`);
    }
  }

  /**
   * Handle DAO zome functions
   */
  private handleDaoZome(fnName: string, payload: any): any {
    switch (fnName) {
      case 'get_proposals':
        return [
          {
            proposal_id: 'prop-001',
            title: 'Add Dark Mode',
            description: 'Implement dark mode theme',
            status: 'active',
            votes_for: 42,
            votes_against: 3,
          },
          {
            proposal_id: 'prop-002',
            title: 'New Course Category: Art',
            description: 'Add art courses to platform',
            status: 'passed',
            votes_for: 87,
            votes_against: 12,
          },
        ];

      case 'create_proposal':
        return {
          proposal_id: `prop-${Date.now()}`,
          ...payload,
          status: 'active',
          votes_for: 0,
          votes_against: 0,
        };

      case 'vote':
        return { success: true, proposal_id: payload.proposal_id };

      default:
        throw new Error(`Unknown function: ${fnName}`);
    }
  }

  /**
   * Simulate network latency
   */
  private async simulateLatency(): Promise<void> {
    const latency = this.config.minLatency! +
      Math.random() * (this.config.maxLatency! - this.config.minLatency!);
    await new Promise(resolve => setTimeout(resolve, latency));
  }

  /**
   * Generate a mock course
   */
  private generateMockCourse(id: string, title: string): any {
    return {
      course_id: id,
      title,
      description: `Learn ${title} from scratch`,
      instructor: 'Prof. Smith',
      syllabus: {
        modules: [
          { module_id: '1', title: 'Introduction', duration_hours: 2 },
          { module_id: '2', title: 'Core Concepts', duration_hours: 4 },
          { module_id: '3', title: 'Advanced Topics', duration_hours: 6 },
        ],
      },
      tags: ['programming', 'intermediate'],
      difficulty: 'intermediate',
      enrollment_count: Math.floor(Math.random() * 500),
      created_at: new Date().toISOString(),
    };
  }

  /**
   * Generate a mock FL round
   */
  private generateMockFlRound(id: string, state: string, participants: number): any {
    return {
      round_id: id,
      model_id: `model-${id}`,
      state,
      current_participants: participants,
      min_participants: 10,
      max_participants: 100,
      aggregation_method: 'trimmed_mean',
      clip_norm: 1.0,
      privacy_params: {
        epsilon: null,
        delta: null,
        clip_norm: 1.0,
      },
      created_at: new Date().toISOString(),
    };
  }

  /**
   * Generate a mock credential
   */
  private generateMockCredential(courseId: string): any {
    return {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://mycelix.network/credentials/v1',
      ],
      type: ['VerifiableCredential', 'EduAchievementCredential'],
      issuer: 'did:key:z6Mk...',
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: 'did:key:z6Mkr...',
        courseId,
        score: 80 + Math.random() * 20,
        scoreBand: 'A',
        skills: ['Critical Thinking', 'Problem Solving'],
        completionDate: new Date().toISOString().split('T')[0],
      },
      proof: {
        type: 'Ed25519Signature2020',
        created: new Date().toISOString(),
        verificationMethod: 'did:key:z6Mk...#keys-1',
        proofPurpose: 'assertionMethod',
        proofValue: 'z' + this.generateHash().slice(0, 86),
      },
    };
  }

  /**
   * Generate a random hash
   */
  private generateHash(): string {
    return Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }
}

// Singleton instance for convenience
let mockClientInstance: MockHolochainClient | null = null;

export function getMockClient(config?: Partial<MockHolochainClientConfig>): MockHolochainClient {
  if (!mockClientInstance) {
    mockClientInstance = new MockHolochainClient(config);
  }
  return mockClientInstance;
}

export function resetMockClient(): void {
  if (mockClientInstance) {
    mockClientInstance.disconnect();
  }
  mockClientInstance = null;
}
