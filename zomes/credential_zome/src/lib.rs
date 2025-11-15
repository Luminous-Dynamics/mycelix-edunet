//! # Credential Zome
//!
//! Manages W3C Verifiable Credentials for educational achievements.

use edunet_core::CourseId;
use serde::{Deserialize, Serialize};
use serde_json::Value;

/// Verifiable Credential entry
///
/// Follows W3C Verifiable Credentials Data Model
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VerifiableCredential {
    /// JSON-LD context
    #[serde(rename = "@context")]
    pub context: Value,

    /// Credential type
    #[serde(rename = "type")]
    pub credential_type: Vec<String>,

    /// Issuer identifier
    pub issuer: String,

    /// Issuance date (ISO 8601)
    pub issuance_date: String,

    /// Credential subject (the learner and their achievement)
    pub credential_subject: CredentialSubject,

    /// Optional expiration date
    #[serde(skip_serializing_if = "Option::is_none")]
    pub expiration_date: Option<String>,

    /// Credential status (for revocation)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub credential_status: Option<CredentialStatus>,

    /// Cryptographic proof
    pub proof: Proof,
}

/// Subject of the credential (learner's achievement)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CredentialSubject {
    /// Learner identifier (agent public key)
    pub id: String,

    /// Course completed
    pub course_id: CourseId,

    /// Model ID (for provenance)
    pub model_id: String,

    /// Rubric/assessment ID
    pub rubric_id: String,

    /// Achievement score or grade
    pub score: Option<f32>,

    /// Score band (e.g., "A", "Pass", "Mastery")
    pub score_band: String,

    /// Additional metadata
    #[serde(flatten)]
    pub metadata: Option<Value>,
}

/// Credential status for revocation checking
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CredentialStatus {
    /// Status list identifier
    pub id: String,

    /// Status method type
    #[serde(rename = "type")]
    pub status_type: String,

    /// Index in status list
    pub status_list_index: Option<u32>,

    /// Purpose (revocation, suspension, etc.)
    pub status_purpose: Option<String>,
}

/// Cryptographic proof
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Proof {
    /// Proof type (e.g., "Ed25519Signature2020")
    #[serde(rename = "type")]
    pub proof_type: String,

    /// Creation timestamp
    pub created: String,

    /// Verification method (public key reference)
    pub verification_method: String,

    /// Proof purpose
    pub proof_purpose: String,

    /// Signature value (base64)
    pub proof_value: String,
}

// TODO: Implement HDK entry definitions and validation
// TODO: Implement zome functions for:
//   - issue_credential
//   - verify_credential
//   - revoke_credential
//   - get_credential
//   - list_credentials (for a subject)
//   - check_credential_status

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_credential_subject() {
        let subject = CredentialSubject {
            id: "did:example:123".to_string(),
            course_id: CourseId("course-1".to_string()),
            model_id: "model-v1".to_string(),
            rubric_id: "rubric-1".to_string(),
            score: Some(95.0),
            score_band: "A".to_string(),
            metadata: None,
        };

        assert_eq!(subject.score_band, "A");
    }
}
