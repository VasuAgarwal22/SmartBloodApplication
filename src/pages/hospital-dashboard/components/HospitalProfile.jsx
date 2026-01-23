import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { dbHelpers } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const HospitalProfile = () => {
  const { userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [profileData, setProfileData] = useState({
    hospital_name: '',
    registration_number: '',
    license_number: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    emergency_phone: '',
    email: '',
    website: '',
    operating_hours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '13:00', closed: false },
      sunday: { open: '00:00', close: '00:00', closed: true }
    },
    services: [],
    emergency_services: false,
    blood_bank_license: '',
    accreditation: '',
    established_year: '',
    total_beds: '',
    icu_beds: '',
    contact_person: '',
    contact_person_designation: '',
    contact_person_phone: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadHospitalProfile();
  }, []);

  const loadHospitalProfile = async () => {
    try {
      const { data, error } = await dbHelpers.getHospitalProfile(userProfile?.id);
      if (error) throw error;

      if (data) {
        setProfileData(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error loading hospital profile:', error);
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
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setProfileData(prev => ({
      ...prev,
      operating_hours: {
        ...prev.operating_hours,
        [day]: {
          ...prev.operating_hours[day],
          [field]: value
        }
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!profileData.hospital_name?.trim()) newErrors.hospital_name = 'Hospital name is required';
    if (!profileData.registration_number?.trim()) newErrors.registration_number = 'Registration number is required';
    if (!profileData.license_number?.trim()) newErrors.license_number = 'License number is required';
    if (!profileData.address?.trim()) newErrors.address = 'Address is required';
    if (!profileData.city?.trim()) newErrors.city = 'City is required';
    if (!profileData.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!profileData.email?.trim()) newErrors.email = 'Email is required';

    // Email validation
    if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Invalid email format';
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
      const { error } = await dbHelpers.updateHospitalProfile(userProfile?.id, profileData);
      if (error) throw error;

      addNotification('Hospital profile updated successfully', 'success');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating hospital profile:', error);
      addNotification('Error updating hospital profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  return (
    <>
      <Helmet>
        <title>Hospital Profile - Hospital Dashboard</title>
      </Helmet>

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Hospital Profile</h3>
            <p className="text-sm text-muted-foreground">
              Manage your hospital information, license details, and operating hours
            </p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
          >
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </Button>
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
          {/* Basic Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Hospital Name"
                placeholder="Enter hospital name"
                value={profileData.hospital_name}
                onChange={(e) => handleInputChange('hospital_name', e.target.value)}
                error={errors.hospital_name}
                disabled={!isEditing}
                required
              />

              <Input
                label="Registration Number"
                placeholder="Hospital registration number"
                value={profileData.registration_number}
                onChange={(e) => handleInputChange('registration_number', e.target.value)}
                error={errors.registration_number}
                disabled={!isEditing}
                required
              />

              <Input
                label="License Number"
                placeholder="Medical license number"
                value={profileData.license_number}
                onChange={(e) => handleInputChange('license_number', e.target.value)}
                error={errors.license_number}
                disabled={!isEditing}
                required
              />

              <Input
                label="Blood Bank License"
                placeholder="Blood bank license number"
                value={profileData.blood_bank_license}
                onChange={(e) => handleInputChange('blood_bank_license', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Address Information</h4>
            <div className="space-y-4">
              <Input
                label="Address"
                placeholder="Full address"
                value={profileData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                error={errors.address}
                disabled={!isEditing}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="City"
                  placeholder="City"
                  value={profileData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  error={errors.city}
                  disabled={!isEditing}
                  required
                />

                <Input
                  label="State"
                  placeholder="State"
                  value={profileData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  disabled={!isEditing}
                />

                <Input
                  label="Pincode"
                  placeholder="Pincode"
                  value={profileData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                placeholder="+1 (555) 123-4567"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={errors.phone}
                disabled={!isEditing}
                required
              />

              <Input
                label="Emergency Phone"
                placeholder="Emergency contact number"
                value={profileData.emergency_phone}
                onChange={(e) => handleInputChange('emergency_phone', e.target.value)}
                disabled={!isEditing}
              />

              <Input
                label="Email"
                type="email"
                placeholder="hospital@example.com"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                disabled={!isEditing}
                required
              />

              <Input
                label="Website"
                placeholder="https://www.hospital.com"
                value={profileData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Operating Hours</h4>
            <div className="space-y-3">
              {daysOfWeek.map(day => (
                <div key={day.key} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-24 font-medium">{day.label}</div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!profileData.operating_hours[day.key]?.closed}
                      onChange={(e) => handleOperatingHoursChange(day.key, 'closed', !e.target.checked)}
                      disabled={!isEditing}
                      className="rounded"
                    />
                    <span className="text-sm">Open</span>
                  </label>
                  {!profileData.operating_hours[day.key]?.closed && (
                    <>
                      <Input
                        type="time"
                        value={profileData.operating_hours[day.key]?.open || '09:00'}
                        onChange={(e) => handleOperatingHoursChange(day.key, 'open', e.target.value)}
                        disabled={!isEditing}
                        className="w-32"
                      />
                      <span className="text-sm">to</span>
                      <Input
                        type="time"
                        value={profileData.operating_hours[day.key]?.close || '17:00'}
                        onChange={(e) => handleOperatingHoursChange(day.key, 'close', e.target.value)}
                        disabled={!isEditing}
                        className="w-32"
                      />
                    </>
                  )}
                  {profileData.operating_hours[day.key]?.closed && (
                    <span className="text-sm text-muted-foreground">Closed</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Additional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Established Year"
                placeholder="2020"
                value={profileData.established_year}
                onChange={(e) => handleInputChange('established_year', e.target.value)}
                disabled={!isEditing}
              />

              <Input
                label="Total Beds"
                type="number"
                placeholder="500"
                value={profileData.total_beds}
                onChange={(e) => handleInputChange('total_beds', e.target.value)}
                disabled={!isEditing}
              />

              <Input
                label="ICU Beds"
                type="number"
                placeholder="50"
                value={profileData.icu_beds}
                onChange={(e) => handleInputChange('icu_beds', e.target.value)}
                disabled={!isEditing}
              />

              <Input
                label="Accreditation"
                placeholder="JCI, NABH, etc."
                value={profileData.accreditation}
                onChange={(e) => handleInputChange('accreditation', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Contact Person */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Person</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Contact Person Name"
                placeholder="Dr. John Smith"
                value={profileData.contact_person}
                onChange={(e) => handleInputChange('contact_person', e.target.value)}
                disabled={!isEditing}
              />

              <Input
                label="Designation"
                placeholder="Medical Director"
                value={profileData.contact_person_designation}
                onChange={(e) => handleInputChange('contact_person_designation', e.target.value)}
                disabled={!isEditing}
              />

              <Input
                label="Contact Phone"
                placeholder="+1 (555) 123-4567"
                value={profileData.contact_person_phone}
                onChange={(e) => handleInputChange('contact_person_phone', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Submit Button */}
          {isEditing && (
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default HospitalProfile;
