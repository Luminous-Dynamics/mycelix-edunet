//! # EduNet Core
//!
//! Core types, cryptographic helpers, and provenance utilities for Mycelix EduNet.
//!
//! This crate provides:
//! - Common data structures used across zomes
//! - Cryptographic primitives (hashing, signatures)
//! - Provenance tracking for models and credentials
//! - Validation utilities

pub mod crypto;
pub mod provenance;
pub mod types;

pub use crypto::*;
pub use provenance::*;
pub use types::*;

/// Current protocol version
pub const PROTOCOL_VERSION: &str = "0.1.0";

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_protocol_version() {
        assert_eq!(PROTOCOL_VERSION, "0.1.0");
    }
}
