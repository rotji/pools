import React, { useState } from 'react';
import { Footer, Header } from '../../components';
import { Button } from '../../components/ui';
import styles from '../../styles/pages/CreateGroup.module.css';


interface CreatePublicGroupProps {
  onNavigateGroups: () => void;
}

interface GroupFormData {
  title: string;
  description: string;
  assetType: string;
  contributionAmount: string;
  duration: string;
  riskLevel: 'low' | 'medium' | 'high';
}

const ASSET_TYPES = [
  { value: 'cryptocurrency', label: 'Cryptocurrency' },
  { value: 'stocks', label: 'Stock Market' },
  { value: 'forex', label: 'Forex Trading' },
  { value: 'commodities', label: 'Commodities' },
  { value: 'mixed', label: 'Mixed Portfolio' }
];

const CONTRIBUTION_AMOUNTS = [
  { value: '50', label: '50 STX' },
  { value: '100', label: '100 STX' },
  { value: '250', label: '250 STX' },
  { value: '500', label: '500 STX' },
  { value: '1000', label: '1000 STX' },
  { value: 'custom', label: 'Custom Amount' }
];

const DURATIONS = [
  { value: '1-week', label: '1 Week' },
  { value: '2-weeks', label: '2 Weeks' },
  { value: '1-month', label: '1 Month' },
  { value: '3-months', label: '3 Months' },
  { value: '6-months', label: '6 Months' },
  { value: '1-year', label: '1 Year' }
];

const RISK_LEVELS = [
  { value: 'low', label: 'Low Risk', description: 'Conservative investments with stable returns' },
  { value: 'medium', label: 'Medium Risk', description: 'Balanced portfolio with moderate volatility' },
  { value: 'high', label: 'High Risk', description: 'Aggressive investments with high potential returns' }
];

const CreatePublicGroup: React.FC<CreatePublicGroupProps> = ({ onNavigateGroups }) => {
  // Auth removed for plain prototype
  const [formData, setFormData] = useState<GroupFormData>({
    title: '',
    description: '',
    assetType: '',
    contributionAmount: '',
    duration: '',
    riskLevel: 'medium'
  });

  const [customAmount, setCustomAmount] = useState('');
  const [errors, setErrors] = useState<Partial<GroupFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field: keyof GroupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<GroupFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Group title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.assetType) {
      newErrors.assetType = 'Please select an asset type';
    }

    if (!formData.contributionAmount) {
      newErrors.contributionAmount = 'Please select a contribution amount';
    }

    if (formData.contributionAmount === 'custom' && !customAmount) {
      newErrors.contributionAmount = 'Please enter a custom amount';
    }

    if (!formData.duration) {
      newErrors.duration = 'Please select an investment duration';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    // No authentication check for plain prototype

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // TODO: Integrate with smart contract
    try {
      console.log('Creating public group:', {
        ...formData,
        contributionAmount: formData.contributionAmount === 'custom' ? customAmount : formData.contributionAmount
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success and redirect
      alert('Group created successfully! Redirecting to groups list...');
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getContributionDisplay = () => {
    if (formData.contributionAmount === 'custom') {
      return customAmount ? `${customAmount} STX` : 'Custom Amount';
    }
    return formData.contributionAmount ? `${formData.contributionAmount} STX` : 'Select Amount';
  };

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.content}>
          {/* Info Section: Platform Logic */}
          <div className={styles.infoSection} style={{ background: '#f5faff', border: '1px solid #b3e5fc', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0, color: '#0277bd', fontSize: '1.2rem', fontWeight: 600 }}>How This Group Works</h2>
            <p style={{ margin: '0.5rem 0 0 0', color: '#01579b', fontSize: '1rem' }}>
              <strong>Each member invests their equal share in <u>any asset of their choice</u> (stocks, forex, crypto, gambling, etc.).<br />
                All profits and losses—no matter who made them—are <u>shared equally</u> among all group members.</strong><br />
              This unique risk-sharing model helps everyone reduce risk and maximize opportunity together.
            </p>
          </div>

          {/* Back Navigation */}
          <div className={styles.backNav}>
            <button onClick={onNavigateGroups} className={styles.backButton}>
              ← Back to Groups
            </button>
          </div>

          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Create Public Group</h1>
            <p className={styles.pageDescription}>
              Start a new investment pool that anyone can join. Set your terms and let others
              participate in shared risk, shared reward investing.
            </p>
          </div>

          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Basic Information */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>🎯 Basic Information</h2>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Group Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Tech Stocks Growth Pool"
                    className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                    maxLength={100}
                  />
                  {errors.title && <span className={styles.errorText}>{errors.title}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your investment strategy and goals..."
                    className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                    rows={4}
                    maxLength={500}
                  />
                  <div className={styles.charCount}>
                    {formData.description.length}/500 characters
                  </div>
                  {errors.description && <span className={styles.errorText}>{errors.description}</span>}
                </div>
              </div>

              {/* Investment Parameters */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>💰 Investment Parameters</h2>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Asset Type *
                  </label>
                  <select
                    value={formData.assetType}
                    onChange={(e) => handleInputChange('assetType', e.target.value)}
                    className={`${styles.select} ${errors.assetType ? styles.inputError : ''}`}
                  >
                    <option value="">Select asset type...</option>
                    {ASSET_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.assetType && <span className={styles.errorText}>{errors.assetType}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Contribution Amount (per member) *
                  </label>
                  <select
                    value={formData.contributionAmount}
                    onChange={(e) => handleInputChange('contributionAmount', e.target.value)}
                    className={`${styles.select} ${errors.contributionAmount ? styles.inputError : ''}`}
                  >
                    <option value="">Select contribution amount...</option>
                    {CONTRIBUTION_AMOUNTS.map(amount => (
                      <option key={amount.value} value={amount.value}>
                        {amount.label}
                      </option>
                    ))}
                  </select>

                  {formData.contributionAmount === 'custom' && (
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter custom amount in STX"
                      className={`${styles.input} ${styles.customAmountInput}`}
                      min="1"
                      step="1"
                    />
                  )}

                  {errors.contributionAmount && <span className={styles.errorText}>{errors.contributionAmount}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Investment Duration *
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className={`${styles.select} ${errors.duration ? styles.inputError : ''}`}
                  >
                    <option value="">Select duration...</option>
                    {DURATIONS.map(duration => (
                      <option key={duration.value} value={duration.value}>
                        {duration.label}
                      </option>
                    ))}
                  </select>
                  {errors.duration && <span className={styles.errorText}>{errors.duration}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Risk Level
                  </label>
                  <div className={styles.riskLevelGrid}>
                    {RISK_LEVELS.map(risk => (
                      <div
                        key={risk.value}
                        className={`${styles.riskOption} ${formData.riskLevel === risk.value ? styles.riskOptionSelected : ''}`}
                        onClick={() => handleInputChange('riskLevel', risk.value)}
                      >
                        <div className={styles.riskLabel}>{risk.label}</div>
                        <div className={styles.riskDescription}>{risk.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              {showPreview && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>👀 Preview</h2>
                  <div className={styles.previewCard}>
                    <div className={styles.previewHeader}>
                      <h3 className={styles.previewTitle}>
                        {formData.title || 'Your Group Title'}
                      </h3>
                      <div className={styles.previewBadges}>
                        <span className={styles.previewBadge}>🌐 Public</span>
                        <span className={`${styles.previewBadge} ${styles[formData.riskLevel]}`}>
                          {formData.riskLevel} risk
                        </span>
                      </div>
                    </div>
                    <p className={styles.previewDescription}>
                      {formData.description || 'Your group description will appear here...'}
                    </p>
                    <div className={styles.previewStats}>
                      <div className={styles.previewStat}>
                        <span className={styles.previewStatLabel}>Asset Type</span>
                        <span className={styles.previewStatValue}>
                          {ASSET_TYPES.find(t => t.value === formData.assetType)?.label || 'Not selected'}
                        </span>
                      </div>
                      <div className={styles.previewStat}>
                        <span className={styles.previewStatLabel}>Contribution</span>
                        <span className={styles.previewStatValue}>
                          {getContributionDisplay()}
                        </span>
                      </div>
                      <div className={styles.previewStat}>
                        <span className={styles.previewStatLabel}>Duration</span>
                        <span className={styles.previewStatValue}>
                          {DURATIONS.find(d => d.value === formData.duration)?.label || 'Not selected'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className={styles.actionSection}>
                <div className={styles.actionButtons}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={() => setShowPreview(!showPreview)}
                    className={styles.previewButton}
                  >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className={styles.submitButton}
                  >
                    {isSubmitting ? 'Creating Group...' : 'Create Public Group'}
                  </Button>
                </div>

                {/* Risk Disclaimer */}
                <div className={styles.riskDisclaimer}>
                  <h4>⚠️ Important Notice</h4>
                  <p>
                    By creating this group, you agree to act as the group coordinator.
                    All investments involve risk and you may lose money. This platform
                    does not provide financial advice. Ensure all group members understand
                    the risks before joining.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreatePublicGroup;