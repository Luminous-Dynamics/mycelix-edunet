//! # EduNet Aggregation
//!
//! Robust aggregation algorithms for federated learning that resist poisoning attacks.
//!
//! Provides:
//! - Trimmed mean aggregation
//! - Median aggregation
//! - Weighted aggregation
//! - Clipping utilities

pub mod errors;
pub mod methods;

pub use errors::*;
pub use methods::*;

/// Configuration for aggregation
#[derive(Debug, Clone)]
pub struct AggregationConfig {
    /// Trim percentage for trimmed mean (0.0 to 0.5)
    pub trim_percent: f64,
    /// Minimum number of updates required
    pub min_updates: usize,
}

impl Default for AggregationConfig {
    fn default() -> Self {
        Self {
            trim_percent: 0.1, // Trim top and bottom 10%
            min_updates: 3,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_config() {
        let config = AggregationConfig::default();
        assert_eq!(config.trim_percent, 0.1);
        assert_eq!(config.min_updates, 3);
    }
}
