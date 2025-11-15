//! Aggregation methods for federated learning

use crate::{AggregationConfig, AggregationError, Result};

/// Compute trimmed mean of vectors
///
/// Trims the top and bottom `trim_percent` of values for each dimension,
/// then computes the mean. This provides robustness against outliers and
/// poisoning attacks.
pub fn trimmed_mean(
    updates: &[Vec<f32>],
    config: &AggregationConfig,
) -> Result<Vec<f32>> {
    if updates.is_empty() {
        return Err(AggregationError::EmptyUpdates);
    }

    if updates.len() < config.min_updates {
        return Err(AggregationError::InsufficientUpdates {
            got: updates.len(),
            min: config.min_updates,
        });
    }

    if config.trim_percent < 0.0 || config.trim_percent > 0.5 {
        return Err(AggregationError::InvalidTrimPercent(config.trim_percent));
    }

    let dim = updates[0].len();

    // Verify all updates have same dimension
    for update in updates {
        if update.len() != dim {
            return Err(AggregationError::DimensionMismatch {
                expected: dim,
                got: update.len(),
            });
        }
    }

    let mut result = vec![0.0; dim];
    let trim_count = (updates.len() as f64 * config.trim_percent).floor() as usize;

    // For each dimension
    for d in 0..dim {
        // Collect values for this dimension
        let mut values: Vec<f32> = updates.iter().map(|u| u[d]).collect();

        // Sort values
        values.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));

        // Trim and compute mean
        let trimmed = &values[trim_count..(values.len() - trim_count)];
        let sum: f32 = trimmed.iter().sum();
        result[d] = sum / trimmed.len() as f32;
    }

    Ok(result)
}

/// Compute median of vectors
///
/// For each dimension, computes the median value across all updates.
/// Provides maximum robustness against outliers (50% breakdown point).
pub fn median(updates: &[Vec<f32>]) -> Result<Vec<f32>> {
    if updates.is_empty() {
        return Err(AggregationError::EmptyUpdates);
    }

    let dim = updates[0].len();

    // Verify all updates have same dimension
    for update in updates {
        if update.len() != dim {
            return Err(AggregationError::DimensionMismatch {
                expected: dim,
                got: update.len(),
            });
        }
    }

    let mut result = vec![0.0; dim];

    // For each dimension
    for d in 0..dim {
        // Collect values for this dimension
        let mut values: Vec<f32> = updates.iter().map(|u| u[d]).collect();

        // Sort values
        values.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));

        // Compute median
        let mid = values.len() / 2;
        result[d] = if values.len() % 2 == 0 {
            (values[mid - 1] + values[mid]) / 2.0
        } else {
            values[mid]
        };
    }

    Ok(result)
}

/// Compute weighted mean of vectors
///
/// Weights could be based on:
/// - Number of training samples
/// - Validation loss
/// - Stake/reputation
pub fn weighted_mean(
    updates: &[Vec<f32>],
    weights: &[f64],
) -> Result<Vec<f32>> {
    if updates.is_empty() {
        return Err(AggregationError::EmptyUpdates);
    }

    if updates.len() != weights.len() {
        return Err(AggregationError::DimensionMismatch {
            expected: updates.len(),
            got: weights.len(),
        });
    }

    // Verify all weights are positive
    for &w in weights {
        if w <= 0.0 {
            return Err(AggregationError::InvalidWeight(w));
        }
    }

    let dim = updates[0].len();

    // Verify all updates have same dimension
    for update in updates {
        if update.len() != dim {
            return Err(AggregationError::DimensionMismatch {
                expected: dim,
                got: update.len(),
            });
        }
    }

    let total_weight: f64 = weights.iter().sum();
    let mut result = vec![0.0; dim];

    for (update, &weight) in updates.iter().zip(weights.iter()) {
        for (d, &value) in update.iter().enumerate() {
            result[d] += value * (weight / total_weight) as f32;
        }
    }

    Ok(result)
}

/// Clip L2 norm of a vector to a maximum value
///
/// If ||v|| > max_norm, scales v to have norm exactly max_norm.
/// This is a key privacy protection mechanism.
pub fn clip_l2_norm(vector: &mut [f32], max_norm: f32) {
    let norm: f32 = vector.iter().map(|x| x * x).sum::<f32>().sqrt();

    if norm > max_norm {
        let scale = max_norm / norm;
        for x in vector.iter_mut() {
            *x *= scale;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_trimmed_mean() {
        let updates = vec![
            vec![1.0, 2.0],
            vec![2.0, 3.0],
            vec![3.0, 4.0],
            vec![100.0, 200.0], // Outlier
        ];

        let config = AggregationConfig {
            trim_percent: 0.25, // Trim top and bottom 25%
            min_updates: 3,
        };

        let result = trimmed_mean(&updates, &config).unwrap();

        // Should ignore the outlier and average the middle values
        assert!((result[0] - 2.5).abs() < 0.1);
        assert!((result[1] - 3.5).abs() < 0.1);
    }

    #[test]
    fn test_median() {
        let updates = vec![
            vec![1.0, 2.0],
            vec![2.0, 3.0],
            vec![3.0, 4.0],
            vec![100.0, 200.0], // Outlier - median is robust
        ];

        let result = median(&updates).unwrap();

        // Median should be between 2nd and 3rd values
        assert_eq!(result[0], 2.5);
        assert_eq!(result[1], 3.5);
    }

    #[test]
    fn test_weighted_mean() {
        let updates = vec![
            vec![1.0, 2.0],
            vec![3.0, 4.0],
        ];

        let weights = vec![1.0, 3.0]; // Second update weighted 3x

        let result = weighted_mean(&updates, &weights).unwrap();

        // Result should be closer to second update
        assert_eq!(result[0], 2.5); // (1*1 + 3*3) / 4
        assert_eq!(result[1], 3.5); // (2*1 + 4*3) / 4
    }

    #[test]
    fn test_clip_l2_norm() {
        let mut vector = vec![3.0, 4.0]; // L2 norm = 5.0
        clip_l2_norm(&mut vector, 1.0);

        // Should be scaled to norm 1.0
        let norm: f32 = vector.iter().map(|x| x * x).sum::<f32>().sqrt();
        assert!((norm - 1.0).abs() < 0.001);
    }

    #[test]
    fn test_insufficient_updates() {
        let updates = vec![vec![1.0, 2.0]];

        let config = AggregationConfig::default();

        let result = trimmed_mean(&updates, &config);
        assert!(matches!(
            result,
            Err(AggregationError::InsufficientUpdates { .. })
        ));
    }
}
