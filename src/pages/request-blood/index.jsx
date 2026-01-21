import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/navigation/Header';
import EmergencyStatusBanner from '../../components/navigation/EmergencyStatusBanner';
import EmergencyFAB from '../../components/navigation/EmergencyFAB';
import NotificationToast from '../../components/navigation/NotificationToast';
import LoadingOverlay from '../../components/navigation/LoadingOverlay';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import PatientInfoSection from './components/PatientInfoSection';
import UrgencyLevelSelector from './components/UrgencyLevelSelector';
import RequesterDetailsSection from './components/RequesterDetailsSection';
import LocationSection from './components/LocationSection';
import AvailabilityPreview from './components/AvailabilityPreview';
import ValidationWarning from './components/ValidationWarning';
import EmergencyOverride from './components/EmergencyOverride';

const RequestBlood = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [validationWarnings, setValidationWarnings] = useState([]);
  const [showEmergencyOverride, setShowEmergencyOverride] = useState(false);
  const [emergencyOverrideActive, setEmergencyOverrideActive] = useState(false);

  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: '',
    quantity: '',
    patientContact: '',
    urgencyLevel: '',
    requesterType: '',
    requesterName: '',
    verificationId: '',
    requesterContact: '',
    requesterEmail: '',
    facilityName: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setAlerts([
      {
        id: 1,
        severity: 'info',
        title: 'System Status',
        message: 'All blood banks operational. Average response time: 18 minutes',
        dismissed: false
      }
    ]);
  }, []);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    if (field === 'requesterType' && value === 'hospital') {
      setShowEmergencyOverride(true);
    } else if (field === 'requesterType') {
      setShowEmergencyOverride(false);
      setEmergencyOverrideActive(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const warnings = [];

    if (!formData?.patientName?.trim()) {
      newErrors.patientName = 'Patient name is required';
    }

    if (!formData?.bloodGroup) {
      newErrors.bloodGroup = 'Blood group selection is required';
    }

    if (!formData?.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (parseInt(formData?.quantity) < 1) {
      newErrors.quantity = 'Minimum 1 unit required';
    } else if (parseInt(formData?.quantity) > 10) {
      newErrors.quantity = 'Maximum 10 units allowed per request';
      warnings?.push('Requests exceeding 10 units require special approval');
    }

    if (!formData?.patientContact?.trim()) {
      newErrors.patientContact = 'Patient contact number is required';
    }

    if (!formData?.urgencyLevel) {
      newErrors.urgencyLevel = 'Please select urgency level';
    }

    if (!formData?.requesterType) {
      newErrors.requesterType = 'Requester type is required';
    }

    if (!formData?.requesterName?.trim()) {
      newErrors.requesterName = 'Requester name is required';
    }

    if (formData?.requesterType === 'hospital' && !formData?.verificationId?.trim()) {
      newErrors.verificationId = 'Hospital verification ID is required';
    } else if (formData?.requesterType === 'hospital' && !formData?.verificationId?.match(/^HOSP-\d{4}-\d{3}$/)) {
      newErrors.verificationId = 'Invalid format. Use: HOSP-YYYY-XXX';
      warnings?.push('Hospital ID format mismatch detected. Please verify credentials.');
    }

    if (formData?.requesterType === 'doctor' && !formData?.verificationId?.trim()) {
      newErrors.verificationId = 'Medical license number is required';
    }

    if (!formData?.requesterContact?.trim()) {
      newErrors.requesterContact = 'Contact number is required';
    }

    if (!formData?.requesterEmail?.trim()) {
      newErrors.requesterEmail = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.requesterEmail)) {
      newErrors.requesterEmail = 'Invalid email format';
    }

    if (!formData?.facilityName?.trim()) {
      newErrors.facilityName = 'Facility name is required';
    }

    if (!formData?.address?.trim()) {
      newErrors.address = 'Street address is required';
    }

    if (!formData?.city?.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData?.state?.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData?.zipCode?.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}$/?.test(formData?.zipCode)) {
      newErrors.zipCode = 'Invalid ZIP code format';
    }

    if (parseInt(formData?.quantity) > 5 && formData?.urgencyLevel === 'normal') {
      warnings?.push('Large quantity requests with normal urgency may experience longer processing times');
    }

    if (formData?.requesterType === 'individual' && formData?.urgencyLevel === 'critical') {
      warnings?.push('Critical requests from individuals require additional verification');
    }

    setErrors(newErrors);
    setValidationWarnings(warnings);

    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      addNotification({
        type: 'warning',
        title: 'Validation Error',
        message: 'Please correct the errors in the form before submitting'
      });
      return;
    }

    setIsLoading(true);
    setLoadingProgress(0);

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const requestData = {
        patientName: formData.patientName,
        bloodGroup: formData.bloodGroup,
        quantity: formData.quantity,
        patientContact: formData.patientContact,
        urgencyLevel: formData.urgencyLevel,
        requesterType: formData.requesterType,
        requesterName: formData.requesterName,
        verificationId: formData.verificationId,
        requesterContact: formData.requesterContact,
        requesterEmail: formData.requesterEmail,
        facilityName: formData.facilityName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      };

      const response = await fetch('http://localhost:5000/api/blood-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        let errorMessage = 'Failed to submit request';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(`${response.status}: ${errorMessage}`);
      }

      const result = await response.json();

      clearInterval(progressInterval);
      setLoadingProgress(100);

      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);

        addNotification({
          type: 'success',
          title: 'Request Submitted Successfully',
          message: `Request ID: ${result.requestId}. Priority Score: ${result.priorityScore}. Estimated processing: 15-20 minutes`,
          action: {
            label: 'View Priority Queue',
            onClick: () => navigate('/emergency-priority-queue')
          }
        });

        setTimeout(() => {
          navigate('/emergency-priority-queue');
        }, 3000);
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      setIsLoading(false);
      setLoadingProgress(0);

      addNotification({
        type: 'error',
        title: 'Submission Failed',
        message: error.message || 'Failed to submit blood request. Please try again.'
      });
    }
  };

  const calculatePriorityScore = () => {
    let score = 0;

    if (formData?.urgencyLevel === 'critical') score += 100;
    else if (formData?.urgencyLevel === 'high') score += 70;
    else score += 40;

    if (formData?.requesterType === 'hospital') score += 30;
    else if (formData?.requesterType === 'doctor') score += 20;
    else score += 10;

    if (emergencyOverrideActive) score += 50;

    const quantity = parseInt(formData?.quantity) || 0;
    score += Math.min(quantity * 2, 20);

    return Math.min(score, 200);
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleNotificationDismiss = (id) => {
    setNotifications(prev => prev?.filter(n => n?.id !== id));
  };

  const handleReset = () => {
    setFormData({
      patientName: '',
      bloodGroup: '',
      quantity: '',
      patientContact: '',
      urgencyLevel: '',
      requesterType: '',
      requesterName: '',
      verificationId: '',
      requesterContact: '',
      requesterEmail: '',
      facilityName: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    });
    setErrors({});
    setValidationWarnings([]);
    setShowEmergencyOverride(false);
    setEmergencyOverrideActive(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <EmergencyStatusBanner alerts={alerts} />
      <EmergencyFAB />
      <NotificationToast 
        notifications={notifications} 
        onDismiss={handleNotificationDismiss} 
      />
      <LoadingOverlay 
        isVisible={isLoading} 
        message="Processing blood request..." 
        progress={loadingProgress} 
      />
      <main className="content-main max-w-screen-2xl mx-auto">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate('/home-dashboard')}
              className="p-2 hover:bg-muted rounded-lg transition-colors duration-250"
            >
              <Icon name="ArrowLeft" size={20} />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold">Request Blood</h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Submit urgent blood requests with comprehensive validation and priority assessment
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm">
              <Icon name="Zap" size={16} />
              <span className="font-medium">Algorithm-Driven Allocation</span>
            </div>
            <div className="flex items-center gap-2 bg-success/10 text-success px-3 py-1.5 rounded-lg text-sm">
              <Icon name="Shield" size={16} />
              <span className="font-medium">Multi-Tier Validation</span>
            </div>
            <div className="flex items-center gap-2 bg-warning/10 text-warning px-3 py-1.5 rounded-lg text-sm">
              <Icon name="Clock" size={16} />
              <span className="font-medium">Real-Time Processing</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <PatientInfoSection
                formData={formData}
                errors={errors}
                onChange={handleFieldChange}
              />

              <UrgencyLevelSelector
                selectedLevel={formData?.urgencyLevel}
                onChange={(level) => handleFieldChange('urgencyLevel', level)}
                error={errors?.urgencyLevel}
              />

              <RequesterDetailsSection
                formData={formData}
                errors={errors}
                onChange={handleFieldChange}
              />

              <LocationSection
                formData={formData}
                errors={errors}
                onChange={handleFieldChange}
              />

              {validationWarnings?.length > 0 && (
                <ValidationWarning warnings={validationWarnings} />
              )}

              {showEmergencyOverride && (
                <EmergencyOverride
                  isVisible={showEmergencyOverride}
                  onOverride={setEmergencyOverrideActive}
                />
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  iconName="Send"
                  iconPosition="right"
                  className="flex-1"
                >
                  Submit Blood Request
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  iconName="RotateCcw"
                  iconPosition="left"
                  onClick={handleReset}
                >
                  Reset Form
                </Button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <AvailabilityPreview
                bloodGroup={formData?.bloodGroup}
                location={formData?.city}
              />
            </div>
          </div>
        </form>

        <div className="mt-8 bg-muted rounded-xl p-4 md:p-6">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold mb-2">How Priority Allocation Works</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Our algorithm-driven system uses a max-heap priority queue to ensure critical cases receive immediate attention while optimizing delivery routes and preventing blood wastage.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span><strong>Urgency Level:</strong> Critical cases receive highest priority (100 points)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span><strong>Requester Type:</strong> Verified hospitals get priority boost (30 points)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span><strong>Quantity:</strong> Larger requests receive proportional priority (up to 20 points)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span><strong>Emergency Override:</strong> Hospital override adds 50 priority points</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RequestBlood;