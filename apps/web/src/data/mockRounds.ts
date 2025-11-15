/**
 * Mock FL round data
 */

export type RoundState =
  | 'DISCOVER'
  | 'JOIN'
  | 'ASSIGN'
  | 'UPDATE'
  | 'AGGREGATE'
  | 'RELEASE'
  | 'COMPLETED'
  | 'FAILED';

export interface FlRound {
  round_id: string;
  model_id: string;
  course_id: string;
  state: RoundState;
  current_participants: number;
  min_participants: number;
  max_participants: number;
  aggregation_method: string;
  clip_norm: number;
  privacy_params: {
    epsilon: number | null;
    delta: number | null;
    clip_norm: number;
  };
  current_model_hash?: string;
  aggregated_model_hash?: string;
  provenance?: {
    contributor_count: number;
    aggregation_method: string;
    update_quality_metrics: {
      median_val_loss: number;
      mean_clipped_norm: number;
      outliers_trimmed: number;
    };
  };
  created_at: string;
  updated_at?: string;
  completed_at?: string;
}

export const mockFlRounds: FlRound[] = [
  {
    round_id: 'fl-round-001-2025-11-15',
    model_id: 'rust-fundamentals-model-v1',
    course_id: 'rust-fundamentals-2025',
    state: 'COMPLETED',
    current_participants: 37,
    min_participants: 10,
    max_participants: 100,
    aggregation_method: 'trimmed_mean',
    clip_norm: 1.0,
    privacy_params: {
      epsilon: null,
      delta: null,
      clip_norm: 1.0,
    },
    current_model_hash: 'blake3:7b2a9f8e4d1c3a5b6e2f8d9c4a1b3e5f7a9c2d4e6b8f1a3c5d7e9b2f4a6c8e1d',
    aggregated_model_hash:
      'blake3:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    provenance: {
      contributor_count: 37,
      aggregation_method: 'trimmed_mean',
      update_quality_metrics: {
        median_val_loss: 0.42,
        mean_clipped_norm: 0.87,
        outliers_trimmed: 3,
      },
    },
    created_at: '2025-11-14T10:00:00Z',
    updated_at: '2025-11-15T14:30:00Z',
    completed_at: '2025-11-15T14:30:00Z',
  },
  {
    round_id: 'fl-round-002-2025-11-16',
    model_id: 'spanish-beginner-model-v2',
    course_id: 'spanish-beginner-2025',
    state: 'UPDATE',
    current_participants: 28,
    min_participants: 10,
    max_participants: 100,
    aggregation_method: 'trimmed_mean',
    clip_norm: 1.0,
    privacy_params: {
      epsilon: null,
      delta: null,
      clip_norm: 1.0,
    },
    current_model_hash: 'blake3:a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890',
    created_at: '2025-11-15T08:00:00Z',
    updated_at: '2025-11-16T12:15:00Z',
  },
  {
    round_id: 'fl-round-003-2025-11-17',
    model_id: 'machine-learning-model-v1',
    course_id: 'machine-learning-intro',
    state: 'JOIN',
    current_participants: 5,
    min_participants: 10,
    max_participants: 100,
    aggregation_method: 'median',
    clip_norm: 2.0,
    privacy_params: {
      epsilon: 1.0,
      delta: 0.00001,
      clip_norm: 2.0,
    },
    created_at: '2025-11-16T14:00:00Z',
    updated_at: '2025-11-17T09:30:00Z',
  },
  {
    round_id: 'fl-round-004-2025-11-18',
    model_id: 'web3-dev-model-v1',
    course_id: 'web3-dev',
    state: 'DISCOVER',
    current_participants: 0,
    min_participants: 10,
    max_participants: 50,
    aggregation_method: 'trimmed_mean',
    clip_norm: 1.0,
    privacy_params: {
      epsilon: null,
      delta: null,
      clip_norm: 1.0,
    },
    created_at: '2025-11-17T16:00:00Z',
  },
  {
    round_id: 'fl-round-005-2025-11-19',
    model_id: 'data-structures-model-v3',
    course_id: 'data-structures',
    state: 'AGGREGATE',
    current_participants: 42,
    min_participants: 10,
    max_participants: 100,
    aggregation_method: 'trimmed_mean',
    clip_norm: 1.0,
    privacy_params: {
      epsilon: null,
      delta: null,
      clip_norm: 1.0,
    },
    current_model_hash: 'blake3:1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
    created_at: '2025-11-18T10:00:00Z',
    updated_at: '2025-11-19T11:45:00Z',
  },
];

export function getRoundById(id: string): FlRound | undefined {
  return mockFlRounds.find(r => r.round_id === id);
}

export function getRoundsByCourse(courseId: string): FlRound[] {
  return mockFlRounds.filter(r => r.course_id === courseId);
}

export function getRoundsByState(state: RoundState): FlRound[] {
  return mockFlRounds.filter(r => r.state === state);
}

export function getActiveRounds(): FlRound[] {
  const activeStates: RoundState[] = ['JOIN', 'ASSIGN', 'UPDATE', 'AGGREGATE'];
  return mockFlRounds.filter(r => activeStates.includes(r.state));
}

export function getCompletedRounds(): FlRound[] {
  return mockFlRounds.filter(r => r.state === 'COMPLETED');
}

/**
 * Get progress percentage for a round based on its state
 */
export function getRoundProgress(round: FlRound): number {
  const stateProgress: Record<RoundState, number> = {
    DISCOVER: 10,
    JOIN: 25,
    ASSIGN: 40,
    UPDATE: 60,
    AGGREGATE: 80,
    RELEASE: 95,
    COMPLETED: 100,
    FAILED: 0,
  };
  return stateProgress[round.state];
}

/**
 * Get human-readable state description
 */
export function getRoundStateDescription(state: RoundState): string {
  const descriptions: Record<RoundState, string> = {
    DISCOVER: 'Discovering participants',
    JOIN: 'Accepting participants',
    ASSIGN: 'Assigning model updates',
    UPDATE: 'Participants training locally',
    AGGREGATE: 'Aggregating model updates',
    RELEASE: 'Releasing aggregated model',
    COMPLETED: 'Round completed successfully',
    FAILED: 'Round failed',
  };
  return descriptions[state];
}
