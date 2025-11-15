//! # DAO Zome
//!
//! Manages decentralized governance for courses, curricula, and protocol parameters.

use serde::{Deserialize, Serialize};
use serde_json::Value;

/// Governance proposal
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Proposal {
    /// Unique identifier
    pub proposal_id: String,

    /// Proposal title
    pub title: String,

    /// Detailed description
    pub description: String,

    /// Proposer agent
    pub proposer: String,

    /// Proposal type (fast, normal, slow)
    pub proposal_type: ProposalType,

    /// Proposal category
    pub category: ProposalCategory,

    /// Current status
    pub status: ProposalStatus,

    /// Vote counts
    pub votes: VoteCount,

    /// Voting deadline
    pub voting_deadline: i64,

    /// Creation timestamp
    pub created_at: i64,

    /// Execution timestamp (if approved and executed)
    pub executed_at: Option<i64>,

    /// Associated actions (to execute if approved)
    pub actions: Vec<Value>,
}

/// Type of governance proposal
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum ProposalType {
    /// Fast path (24-48 hours, emergency fixes)
    Fast,
    /// Normal path (3-14 days, features and updates)
    Normal,
    /// Slow path (14+ days, protocol changes)
    Slow,
}

/// Category of proposal
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum ProposalCategory {
    /// Course content and curriculum
    Curriculum,
    /// Protocol parameters (aggregation, privacy)
    Protocol,
    /// Credential standards and rubrics
    Credentials,
    /// Treasury and resource allocation
    Treasury,
    /// Governance rules themselves
    Governance,
    /// Emergency actions
    Emergency,
}

/// Status of a proposal
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum ProposalStatus {
    /// Open for voting
    Active,
    /// Approved, pending execution
    Approved,
    /// Approved and executed
    Executed,
    /// Rejected by vote
    Rejected,
    /// Cancelled by proposer
    Cancelled,
    /// Vetoed by maintainer
    Vetoed,
}

/// Vote tallies
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VoteCount {
    pub for_votes: u32,
    pub against_votes: u32,
    pub abstain_votes: u32,
}

/// Individual vote
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Vote {
    /// Proposal being voted on
    pub proposal_id: String,

    /// Voter agent
    pub voter: String,

    /// Vote choice
    pub choice: VoteChoice,

    /// Optional justification
    pub justification: Option<String>,

    /// Vote timestamp
    pub timestamp: i64,
}

/// Vote choice
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum VoteChoice {
    For,
    Against,
    Abstain,
}

// TODO: Implement HDK entry definitions and validation
// TODO: Implement zome functions for:
//   - create_proposal
//   - vote_on_proposal
//   - execute_proposal
//   - cancel_proposal
//   - veto_proposal (maintainer only)
//   - get_proposal
//   - list_proposals
//   - get_vote_results

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_proposal_creation() {
        let proposal = Proposal {
            proposal_id: "prop-1".to_string(),
            title: "Update aggregation method".to_string(),
            description: "Switch to median aggregation".to_string(),
            proposer: "agent123".to_string(),
            proposal_type: ProposalType::Normal,
            category: ProposalCategory::Protocol,
            status: ProposalStatus::Active,
            votes: VoteCount {
                for_votes: 0,
                against_votes: 0,
                abstain_votes: 0,
            },
            voting_deadline: 1234567890,
            created_at: 1234560000,
            executed_at: None,
            actions: vec![],
        };

        assert_eq!(proposal.proposal_type, ProposalType::Normal);
    }
}
