import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Checkbox from '../../../components/ui/Checkbox';
import { dbHelpers } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const DonationEntry = () => {
  const { userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [donors, setDonors] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [formData, setFormData] = useState({
    donor_id: '',
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    blood_group: '',
    donation_date: new Date().toISOString().split('T')[0],
    donation_type: 'whole_blood',
    quantity: '450', // ml
    hemoglobin_level: '',
    blood_pressure: '',
    temperature: '',
    weight: '',
    notes: '',
    is_first_time: false,
    consent_given: false
  });

  const [errors, setErrors] = useState({});

  const bloodGroups = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  const donationTypes = [
    { value: 'whole_blood', label: 'Whole Blood (450ml)' },
    { value: 'plasma', label: 'Plasma Donation' },
    { value: 'platelets', label: 'Platelet Donation' },
    { value: 'double_red', label: 'Double Red Cell' }
  ];

  useEffect(() => {
    loadDonors();
  }, []);

  const loadDonors = async () => {
    try {
      const { data, error } = await dbHelpers.getVerifiedDonors();
      if (error) throw error;
      setDonors(data || []);
    } catch (error) {
      console.error('Error loading donors:', error);
    }
  };

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Auto-fill donor info when selecting existing donor
    if (field === 'donor_id' && value) {
      const selectedDonor = donors.find(d => d.id === value);
      if (selectedDonor) {
        setFormData(prev => ({
          ...prev,
          donor_name: selectedDonor.full_name || '',
          donor_email: selectedDonor.email || '',
          donor_phone: selectedDonor.phone || '',
          blood_group: selectedDonor.blood_group || '',
          is_first_time: selectedDonor.donation_count === 0
        }));
      }
    }

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.donor_name?.trim()) newErrors.donor_name = 'Donor name is required';
    if (!formData.blood_group) newErrors.blood_group = 'Blood group is required';
    if (!formData.donation_date) newErrors.donation_date = 'Donation date is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    if (!formData.consent_given) newErrors.consent_given = 'Donor consent is required';

    // Health checks
    if (formData.hemoglobin_level && parseFloat(formData.hemoglobin_level) < 12.5) {
      newErrors.hemoglobin_level = 'Hemoglobin level too low for donation';
    }

    if (formData.temperature && (parseFloat(formData.temperature) < 36.1 || parseFloat(formData.temperature) > 37.5)) {
      newErrors.temperature = 'Temperature outside safe range';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      addNotification('Please correct the errors and try again', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Create or update donor record
      let donorId = formData.donor_id;
      if (!donorId) {
        // Create new donor
        const donorData = {
          full_name: formData.donor_name,
          email: formData.donor_email,
          phone: formData.donor_phone,
          blood_group: formData.blood_group,
          registration_date: new Date().toISOString(),
          status: 'verified'
        };
        const { data: newDonor, error: donorError } = await dbHelpers.createDonor(donorData);
        if (donorError) throw donorError;
        donorId = newDonor.id;
      }

      // Record donation
      const donationData = {
        donor_id: donorId,
        hospital_id: userProfile?.id,
        donation_date: formData.donation_date,
        donation_type: formData.donation_type,
        quantity: parseFloat(formData.quantity),
        blood_group: formData.blood_group,
        hemoglobin_level: formData.hemoglobin_level ? parseFloat(formData.hemoglobin_level) : null,
        blood_pressure: formData.blood_pressure || null,
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        notes: formData.notes || null,
        is_first_time: formData.is_first_time,
        consent_given: formData.consent_given,
        status: 'completed'
      };

      const { error: donationError } = await dbHelpers.recordDonation(donationData);
      if (donationError) throw donationError;

      // Update inventory
      const inventoryUpdate = {
        hospital_id: userProfile?.id,
        blood_group: formData.blood_group,
        quantity: Math.floor(parseFloat(formData.quantity) / 450), // Convert ml to units
        expiry_date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 35 days expiry
        status: 'available'
      };

      await dbHelpers.addInventoryItem(inventoryUpdate);

      addNotification('Donation recorded successfully and inventory updated', 'success');

      // Reset form
      setFormData({
        donor_id: '',
        donor_name: '',
        donor_email: '',
        donor_phone: '',
        blood_group: '',
        donation_date: new Date().toISOString().split('T')[0],
        donation_type: 'whole_blood',
        quantity: '450',
        hemoglobin_level: '',
        blood_pressure: '',
        temperature: '',
        weight: '',
        notes: '',
        is_first_time: false,
        consent_given: false
      });

      loadDonors(); // Refresh donor list

    } catch (error) {
      console.error('Error recording donation:', error);
      addNotification('Error recording donation', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Donation Entry - Hospital Dashboard</title>
      </Helmet>

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Blood Donation Entry</h3>
          <p className="text-sm text-muted-foreground">
            Record blood donations and automatically update your inventory
          </p>
        </div>

        {/* Notifications */}
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`mb-4 p-3 rounded-lg text-sm ${
              notification.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
              notification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
              'bg-blue-50 text-blue-700 border border-blue-200'
            }`}
          >
            {notification.message}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Donor Selection */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Donor Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Existing Donor (Optional)</label>
                <select
                  value={formData.donor_id}
                  onChange={(e) => handleInputChange('donor_id', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                >
                  <option value="">New Donor</option>
                  {donors.map(donor => (
                    <option key={donor.id} value={donor.id}>
                      {donor.full_name} - {donor.blood_group} ({donor.phone})
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Donor Name"
                placeholder="Full name"
                value={formData.donor_name}
                onChange={(e) => handleInputChange('donor_name', e.target.value)}
                error={errors.donor_name}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Input
                label="Email"
                type="email"
                placeholder="donor@example.com"
                value={formData.donor_email}
                onChange={(e) => handleInputChange('donor_email', e.target.value)}
              />

              <Input
                label="Phone"
                placeholder="+1 (555) 123-4567"
                value={formData.donor_phone}
                onChange={(e) => handleInputChange('donor_phone', e.target.value)}
              />

              <Select
                label="Blood Group"
                placeholder="Select blood group"
                options={bloodGroups}
                value={formData.blood_group}
                onChange={(value) => handleInputChange('blood_group', value)}
                error={errors.blood_group}
                required
              />
            </div>
          </div>

          {/* Donation Details */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Donation Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Donation Date"
                type="date"
                value={formData.donation_date}
                onChange={(e) => handleInputChange('donation_date', e.target.value)}
                error={errors.donation_date}
                required
              />

              <Select
                label="Donation Type"
                placeholder="Select type"
                options={donationTypes}
                value={formData.donation_type}
                onChange={(value) => handleInputChange('donation_type', value)}
              />

              <Input
                label="Quantity (ml)"
                type="number"
                placeholder="450"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                error={errors.quantity}
                required
              />

              <div className="flex items-center space-x-2 mt-8">
                <Checkbox
                  checked={formData.is_first_time}
                  onChange={(checked) => handleInputChange('is_first_time', checked)}
                />
                <label className="text-sm">First-time donor</label>
              </div>
            </div>
          </div>

          {/* Health Screening */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Health Screening</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Hemoglobin (g/dL)"
                type="number"
                step="0.1"
                placeholder="13.5"
                value={formData.hemoglobin_level}
                onChange={(e) => handleInputChange('hemoglobin_level', e.target.value)}
                error={errors.hemoglobin_level}
              />

              <Input
                label="Blood Pressure"
                placeholder="120/80"
                value={formData.blood_pressure}
                onChange={(e) => handleInputChange('blood_pressure', e.target.value)}
              />

              <Input
                label="Temperature (°C)"
                type="number"
                step="0.1"
                placeholder="36.5"
                value={formData.temperature}
                onChange={(e) => handleInputChange('temperature', e.target.value)}
                error={errors.temperature}
              />

              <Input
                label="Weight (kg)"
                type="number"
                placeholder="70"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
              />
            </div>
          </div>

          {/* Consent and Notes */}
          <div>
            <div className="mb-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={formData.consent_given}
                  onChange={(checked) => handleInputChange('consent_given', checked)}
                  className="mt-1"
                />
                <div>
                  <label className="text-sm font-medium">
                    Donor Consent Given
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Donor has provided informed consent for blood donation and understands the process.
                  </p>
                  {errors.consent_given && (
                    <p className="text-sm text-red-600 mt-1">{errors.consent_given}</p>
                  )}
                </div>
              </div>
            </div>

            <Input
              label="Notes"
              placeholder="Any additional notes or observations"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className="px-8"
            >
              {isLoading ? 'Recording Donation...' : 'Record Donation'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default DonationEntry;
