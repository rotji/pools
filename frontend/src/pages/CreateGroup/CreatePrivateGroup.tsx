import React, { useState } from 'react';
import { Header, Footer } from '../../components';
import { Button } from '../../components/ui';
import styles from '../../styles/pages/CreateGroup.module.css';
import { useAuth } from '../../contexts/AuthContext';

interface CreatePrivateGroupProps {
  onNavigateHome: () => void;
  onNavigateGroups: () => void;
  onNavigateCreate: () => void;
}

interface PrivateGroupFormData {
  title: string;
  description: string;
  assetType: string;
  contributionAmount: string;
  duration: string;
  riskLevel: 'low' | 'medium' | 'high';
  maxMembers: string;
  inviteMethod: 'manual' | 'link' | 'approval';
  requireApproval: boolean;
  inviteEmails: string[];
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

const MAX_MEMBERS_OPTIONS = [
  { value: '5', label: '5 Members' },
  { value: '10', label: '10 Members' },
  { value: '15', label: '15 Members' },
  { value: '20', label: '20 Members' },
  { value: '25', label: '25 Members' },
  { value: 'custom', label: 'Custom Limit' }
];

const INVITE_METHODS = [
  { 
    value: 'manual', 
    label: 'Manual Invitations', 
    description: 'Send invites to specific wallet addresses or emails' 
  },
  { 
    value: 'link', 
    label: 'Invitation Link', 
    description: 'Generate a private link that can be shared' 
  },
  { 
    value: 'approval', 
    label: 'Request & Approval', 
    description: 'Users can request to join, you approve them' 
  }
];

const CreatePrivateGroup: React.FC<CreatePrivateGroupProps> = ({
  onNavigateGroups
}) => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<PrivateGroupFormData>({
    title: '',
    description: '',
    assetType: '',
    contributionAmount: '',
    duration: '',
    riskLevel: 'medium',
    maxMembers: '10',
    inviteMethod: 'manual',
    requireApproval: true,
    inviteEmails: []
  });

  const [customAmount, setCustomAmount] = useState('');
  const [customMaxMembers, setCustomMaxMembers] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [errors, setErrors] = useState<Partial<PrivateGroupFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field: keyof PrivateGroupFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof Partial<PrivateGroupFormData>]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addEmail = () => {
    const email = emailInput.trim();
    if (email && !formData.inviteEmails.includes(email)) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email) || email.startsWith('ST')) {
        handleInputChange('inviteEmails', [...formData.inviteEmails, email]);
        setEmailInput('');
      } else {
        alert('Please enter a valid email address or Stacks wallet address');
      }
    }
  };

  const removeEmail = (emailToRemove: string) => {
    handleInputChange('inviteEmails', formData.inviteEmails.filter(email => email !== emailToRemove));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PrivateGroupFormData> = {};

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

    if (formData.maxMembers === 'custom' && !customMaxMembers) {
      newErrors.maxMembers = 'Please enter a custom member limit';
    }

    if (formData.inviteMethod === 'manual' && formData.inviteEmails.length === 0) {
      // This is just a warning, not a blocking error
      console.warn('No initial invites added - group will be created but no invitations will be sent');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please log in to create a group');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Creating private group:', {
        ...formData,
        contributionAmount: formData.contributionAmount === 'custom' ? customAmount : formData.contributionAmount,
        maxMembers: formData.maxMembers === 'custom' ? customMaxMembers : formData.maxMembers,
        creator: user?.username || user?.email
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success and redirect
      alert('Private group created successfully! Invitations will be sent to specified members.');
      onNavigateGroups();
    } catch (error) {
      console.error('Error creating private group:', error);
      alert('Failed to create private group. Please try again.');
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

  const getMembersDisplay = () => {
    if (formData.maxMembers === 'custom') {
      return customMaxMembers ? `${customMaxMembers} Members` : 'Custom Limit';
    }
    return formData.maxMembers ? `${formData.maxMembers} Members` : 'Select Limit';
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.content}>
          {/* Back Navigation */}
          <div className={styles.backNav}>
            <button onClick={onNavigateGroups} className={styles.backButton}>
              ← Back to Groups
            </button>
          </div>

          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Create Private Group</h1>
            <p className={styles.pageDescription}>
              Create an exclusive investment pool for invited members only. Control who joins 
              and maintain privacy with invitation-based membership.
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
                    placeholder="e.g., Elite Crypto Circle"
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
                    placeholder="Describe your private investment strategy and member expectations..."
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

              {/* Privacy & Member Settings */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>🔒 Privacy & Member Settings</h2>
                
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Maximum Members
                  </label>
                  <select
                    value={formData.maxMembers}
                    onChange={(e) => handleInputChange('maxMembers', e.target.value)}
                    className={styles.select}
                  >
                    {MAX_MEMBERS_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  
                  {formData.maxMembers === 'custom' && (
                    <input
                      type="number"
                      value={customMaxMembers}
                      onChange={(e) => setCustomMaxMembers(e.target.value)}
                      placeholder="Enter maximum number of members"
                      className={`${styles.input} ${styles.customAmountInput}`}
                      min="2"
                      max="100"
                      step="1"
                    />
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Invitation Method
                  </label>
                  <div className={styles.riskLevelGrid}>
                    {INVITE_METHODS.map(method => (
                      <div
                        key={method.value}
                        className={`${styles.riskOption} ${formData.inviteMethod === method.value ? styles.riskOptionSelected : ''}`}
                        onClick={() => handleInputChange('inviteMethod', method.value)}
                      >
                        <div className={styles.riskLabel}>{method.label}</div>
                        <div className={styles.riskDescription}>{method.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.requireApproval}
                      onChange={(e) => handleInputChange('requireApproval', e.target.checked)}
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxText}>
                      Require approval for all new members
                    </span>
                  </label>
                  <div className={styles.helpText}>
                    When enabled, you must approve each member before they can join the group
                  </div>
                </div>

                {/* Initial Invitations */}
                {formData.inviteMethod === 'manual' && (
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Initial Invitations (Optional)
                    </label>
                    <div className={styles.emailInputContainer}>
                      <input
                        type="text"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Enter email or Stacks address (e.g., user@email.com or ST1ABC...)"
                        className={styles.input}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEmail())}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="md"
                        onClick={addEmail}
                        className={styles.addEmailButton}
                      >
                        Add
                      </Button>
                    </div>
                    
                    {formData.inviteEmails.length > 0 && (
                      <div className={styles.emailList}>
                        <div className={styles.emailListHeader}>
                          Invited Members ({formData.inviteEmails.length}):
                        </div>
                        {formData.inviteEmails.map((email, index) => (
                          <div key={index} className={styles.emailItem}>
                            <span className={styles.emailText}>{email}</span>
                            <button
                              type="button"
                              onClick={() => removeEmail(email)}
                              className={styles.removeEmailButton}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Preview Section */}
              {showPreview && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>👀 Preview</h2>
                  <div className={styles.previewCard}>
                    <div className={styles.previewHeader}>
                      <h3 className={styles.previewTitle}>
                        {formData.title || 'Your Private Group Title'}
                      </h3>
                      <div className={styles.previewBadges}>
                        <span className={styles.previewBadge}>🔒 Private</span>
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
                      <div className={styles.previewStat}>
                        <span className={styles.previewStatLabel}>Max Members</span>
                        <span className={styles.previewStatValue}>
                          {getMembersDisplay()}
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
                    {isSubmitting ? 'Creating Private Group...' : 
                     !isAuthenticated ? 'Login to Create' : 
                     'Create Private Group'}
                  </Button>
                </div>

                {/* Privacy Notice */}
                <div className={styles.riskDisclaimer}>
                  <h4>🔒 Privacy Notice</h4>
                  <p>
                    This private group will only be visible to invited members. You control who can join 
                    and all group activities remain confidential. Initial invitations will be sent 
                    immediately upon group creation. Members can only join through your direct invitation.
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

export default CreatePrivateGroup;