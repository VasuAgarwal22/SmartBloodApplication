import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Checkbox from '../../../components/ui/Checkbox';
import { dbHelpers } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const DonorRegistrationForm = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    bloodGroup: '',
    lastDonationDate: '',
    availabilityStatus: 'available',
    phone: '',
    address: '',
    emergencyContact: '',
    emergencyContactPhone: ''
  });

  const [healthEligibility, setHealthEligibility] = useState({
    age18to65: false,
    weightAbove50: false,
    noRecentIllness: false,
    noChronicDisease: false,
    noRecentSurgery: false,
    noRecentTattoo: false,
    noRecentPregnancy: false,
    noRecentBloodTransfusion: false,
    noHighRiskBehavior: false,
    noMedication: false
  });

  const [errors, setErrors] = useState({});
  const [eligibilityErrors, setEligibilityErrors] = useState({});

  const bloodGroupOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  const availabilityOptions = [
    { value: 'available', label: 'Available for Donation' },
    { value: 'unavailable', label: 'Currently Unavailable' },
    { value: 'temporary', label: 'Temporarily Unavailable' }
  ];

  const healthQuestions = [
    { key: 'age18to65', label: 'I am between 18-65 years old', required: true },
    { key: 'weightAbove50', label: 'I weigh more than 50 kg', required: true },
    { key: 'noRecentIllness', label: 'I have not had any illness in the last 2 weeks', required: true },
    { key: 'noChronicDisease', label: 'I do not have any chronic diseases (diabetes, hypertension, etc.)', required: true },
    { key: 'noRecentSurgery', label: 'I have not undergone any surgery in the last 6 months', required: true },
    { key: 'noRecentTattoo', label: 'I have not had any tattoo or piercing in the last 6 months', required: true },
    { key: 'noRecentPregnancy', label: 'I am not pregnant or have not been pregnant in the last 6 months', required: false },
    { key: 'noRecentBloodTransfusion', label: 'I have not received blood transfusion in the last 6 months', required: true },
    { key: 'noHighRiskBehavior', label: 'I have not engaged in high-risk behaviors', required: true },
    { key: 'noMedication', label: 'I am not taking any medications that affect blood donation', required: true }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleEligibilityChange = (key, checked) => {
    setHealthEligibility(prev => ({ ...prev, [key]: checked }));
    if (eligibilityErrors[key]) {
      setEligibilityErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const newEligibilityErrors = {};

    // Basic validation
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (!formData.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address?.trim()) newErrors.address = 'Address is required';
    if (!formData.emergencyContact?.trim()) newErrors.emergencyContact = 'Emergency contact is required';
    if (!formData.emergencyContactPhone?.trim()) newErrors.emergencyContactPhone = 'Emergency contact phone is required';

    // Phone validation
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    // Eligibility validation
    healthQuestions.forEach(question => {
      if (question.required && !healthEligibility[question.key]) {
        newEligibilityErrors[question.key] = 'This is required for blood donation';
      }
    });

    setErrors(newErrors);
    setEligibilityErrors(newEligibilityErrors);

    return Object.keys(newErrors).length === 0 && Object.keys(newEligibilityErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const donorData = {
        user_id: user.id,
        blood_group: formData.bloodGroup,
        last_donation_date: formData.lastDonationDate || null,
        availability_status: formData.availabilityStatus,
        phone: formData.phone,
        address: formData.address,
        emergency_contact: formData.emergencyContact,
        emergency_contact_phone: formData.emergencyContactPhone,
        health_eligibility: healthEligibility,
        registration_date: new Date().toISOString(),
        status: 'pending_verification'
      };

      const { data, error } = await dbHelpers.createDonor(donorData);

      if (error) throw error;

      onSuccess && onSuccess(data);
      onClose && onClose();

    } catch (error) {
      console.error('Error registering donor:', error);
      setErrors({ submit: error.message || 'Failed to register as donor. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Donor Registration - SmartBloodApplication</title>
      </Helmet>

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-background rounded-xl border border-border shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Register as Blood Donor</h2>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Blood Group"
                    placeholder="Select your blood group"
                    options={bloodGroupOptions}
                    value={formData.bloodGroup}
                    onChange={(value) => handleInputChange('bloodGroup', value)}
                    error={errors.bloodGroup}
                    required
                  />

                  <Select
                    label="Availability Status"
                    placeholder="Select availability"
                    options={availabilityOptions}
                    value={formData.availabilityStatus}
                    onChange={(value) => handleInputChange('availabilityStatus', value)}
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={errors.phone}
                    required
                  />

                  <Input
                    label="Last Donation Date"
                    type="date"
                    value={formData.lastDonationDate}
                    onChange={(e) => handleInputChange('lastDonationDate', e.target.value)}
                  />
                </div>

                <div className="mt-4">
                  <Input
                    label="Address"
                    placeholder="Your complete address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    error={errors.address}
                    required
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Emergency Contact Name"
                    placeholder="Full name"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    error={errors.emergencyContact}
                    required
                  />

                  <Input
                    label="Emergency Contact Phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                    error={errors.emergencyContactPhone}
                    required
                  />
                </div>
              </div>

              {/* Health Eligibility Checklist */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Health Eligibility Checklist</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Please confirm the following statements. All required fields must be checked to proceed.
                </p>

                <div className="space-y-3">
                  {healthQuestions.map((question) => (
                    <div key={question.key} className="flex items-start gap-3">
                      <Checkbox
                        checked={healthEligibility[question.key]}
                        onChange={(checked) => handleEligibilityChange(question.key, checked)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label className="text-sm cursor-pointer">
                          {question.label}
                          {question.required && <span className="text-error ml-1">*</span>}
                        </label>
                        {eligibilityErrors[question.key] && (
                          <p className="text-sm text-error mt-1">{eligibilityErrors[question.key]}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {errors.submit && (
                <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                  <p className="text-sm text-error">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Registering...' : 'Register as Donor'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DonorRegistrationForm;
