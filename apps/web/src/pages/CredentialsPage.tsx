/**
 * CredentialsPage Component
 *
 * Display user's verifiable credentials with verification and sharing options
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CredentialCard } from '../components/CredentialCard';
import { LoadingCard } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { mockCredentials, VerifiableCredential, verifyCredential } from '../data/mockCredentials';

export const CredentialsPage: React.FC = () => {
  const [selectedCredential, setSelectedCredential] = useState<VerifiableCredential | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    reason?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<VerifiableCredential[]>([]);

  // Simulate data fetching
  useEffect(() => {
    const fetchCredentials = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simulate occasional error (5% chance)
        if (Math.random() < 0.05) {
          throw new Error('Failed to load credentials');
        }

        setCredentials(mockCredentials);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCredentials();
  }, []);

  // Memoized stats
  const verifiedCount = useMemo(
    () => credentials.filter((c) => c.proof).length,
    [credentials]
  );

  const totalFlContributions = useMemo(
    () => credentials.reduce((sum, c) => sum + (c.credentialSubject.flContributions || 0), 0),
    [credentials]
  );

  const handleCredentialClick = useCallback((credential: VerifiableCredential) => {
    setSelectedCredential(credential);
    setVerificationResult(null);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCredential(null);
    setVerificationResult(null);
  }, []);

  const handleVerify = useCallback(() => {
    if (selectedCredential) {
      const result = verifyCredential(selectedCredential);
      setVerificationResult(result);
    }
  }, [selectedCredential]);

  const handleShare = useCallback(() => {
    if (selectedCredential) {
      const jsonString = JSON.stringify(selectedCredential, null, 2);
      navigator.clipboard.writeText(jsonString).then(() => {
        alert('Credential JSON copied to clipboard!');
      });
    }
  }, [selectedCredential]);

  const handleDownload = useCallback(() => {
    if (selectedCredential) {
      const jsonString = JSON.stringify(selectedCredential, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `credential-${selectedCredential.credentialSubject.courseId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [selectedCredential]);

  // Show loading state
  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: '#111827' }}>
            My Credentials
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: '16px', color: '#6b7280' }}>
            Loading your credentials...
          </p>
        </div>

        {/* Loading skeleton grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {[1, 2, 3].map((i) => (
            <LoadingCard key={i} height="180px" />
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: '#111827' }}>
            My Credentials
          </h1>
        </div>

        <ErrorState
          title="Failed to Load Credentials"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: '#111827' }}>
          My Credentials
        </h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '16px', color: '#6b7280' }}>
          Your verifiable achievements and participation records
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            padding: '20px',
            backgroundColor: '#eff6ff',
            borderRadius: '8px',
            border: '1px solid #bfdbfe',
          }}
        >
          <div style={{ fontSize: '14px', color: '#1e40af', marginBottom: '4px' }}>
            Total Credentials
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#1e3a8a' }}>
            {credentials.length}
          </div>
        </div>

        <div
          style={{
            padding: '20px',
            backgroundColor: '#ecfdf5',
            borderRadius: '8px',
            border: '1px solid #a7f3d0',
          }}
        >
          <div style={{ fontSize: '14px', color: '#047857', marginBottom: '4px' }}>
            Verified
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#065f46' }}>
            {verifiedCount}
          </div>
        </div>

        <div
          style={{
            padding: '20px',
            backgroundColor: '#fef3c7',
            borderRadius: '8px',
            border: '1px solid #fde68a',
          }}
        >
          <div style={{ fontSize: '14px', color: '#92400e', marginBottom: '4px' }}>
            FL Contributions
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#78350f' }}>
            {totalFlContributions}
          </div>
        </div>
      </div>

      {/* Credentials Grid */}
      {credentials.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {credentials.map((credential, index) => (
            <CredentialCard
              key={index}
              credential={credential}
              onClick={handleCredentialClick}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: '64px 24px',
            textAlign: 'center',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
          }}
        >
          <p style={{ margin: 0, fontSize: '16px', color: '#6b7280' }}>
            No credentials yet
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#9ca3af' }}>
            Complete courses to earn verifiable credentials
          </p>
        </div>
      )}

      {/* Credential Detail Modal */}
      {selectedCredential && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px',
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: '32px',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid #d1d5db',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>

            {/* Credential Details */}
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700' }}>
              Credential Details
            </h2>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#6b7280' }}>
              W3C Verifiable Credential
            </p>

            {/* JSON View */}
            <div
              style={{
                backgroundColor: '#1f2937',
                color: '#f3f4f6',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontFamily: 'monospace',
                overflowX: 'auto',
                marginBottom: '24px',
                maxHeight: '400px',
                overflow: 'auto',
              }}
            >
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {JSON.stringify(selectedCredential, null, 2)}
              </pre>
            </div>

            {/* Verification Result */}
            {verificationResult && (
              <div
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '24px',
                  backgroundColor: verificationResult.valid ? '#ecfdf5' : '#fef2f2',
                  border: `1px solid ${verificationResult.valid ? '#10b981' : '#ef4444'}`,
                }}
              >
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: verificationResult.valid ? '#059669' : '#dc2626',
                    marginBottom: '4px',
                  }}
                >
                  {verificationResult.valid ? '✓ Credential Valid' : '✕ Credential Invalid'}
                </div>
                {verificationResult.reason && (
                  <div
                    style={{
                      fontSize: '13px',
                      color: verificationResult.valid ? '#047857' : '#b91c1c',
                    }}
                  >
                    {verificationResult.reason}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleVerify}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                  backgroundColor: '#10b981',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#10b981';
                }}
              >
                Verify
              </button>

              <button
                onClick={handleShare}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                  backgroundColor: '#3b82f6',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                }}
              >
                Copy JSON
              </button>

              <button
                onClick={handleDownload}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                  backgroundColor: '#6b7280',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4b5563';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#6b7280';
                }}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
