// OTP Service for Aadhaar verification
// In production, integrate with actual SMS gateway

class OTPService {
  constructor() {
    this.otpStore = new Map(); // In production, use Redis or database
    this.attemptsStore = new Map();
    this.expiryTime = 5 * 60 * 1000; // 5 minutes
    this.maxAttempts = 3;
  }

  /**
   * Generates a 6-digit OTP
   * @returns {string} - 6-digit OTP
   */
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Sends OTP to mobile number linked with Aadhaar
   * @param {string} aadhaar - Aadhaar number
   * @param {string} mobile - Mobile number (for demo, we'll mock this)
   * @returns {Promise<{success: boolean, message: string, otpId?: string}>}
   */
  async sendOTP(aadhaar, mobile) {
    try {
      // In production, validate Aadhaar exists and get linked mobile
      // For demo, we'll accept any valid Aadhaar

      const otpId = `otp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const otp = this.generateOTP();

      // Store OTP with expiry
      this.otpStore.set(otpId, {
        otp,
        aadhaar,
        mobile,
        createdAt: Date.now(),
        verified: false
      });

      // Reset attempts
      this.attemptsStore.set(otpId, 0);

      // In production, send SMS here
      console.log(`OTP for Aadhaar ${aadhaar}: ${otp} (sent to ${mobile})`);

      // Auto-expire after 5 minutes
      setTimeout(() => {
        this.otpStore.delete(otpId);
        this.attemptsStore.delete(otpId);
      }, this.expiryTime);

      return {
        success: true,
        message: 'OTP sent successfully',
        otpId
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.'
      };
    }
  }

  /**
   * Verifies OTP
   * @param {string} otpId - OTP ID
   * @param {string} enteredOTP - User entered OTP
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async verifyOTP(otpId, enteredOTP) {
    try {
      const otpData = this.otpStore.get(otpId);

      if (!otpData) {
        return {
          success: false,
          message: 'OTP expired or invalid'
        };
      }

      // Check attempts
      const attempts = this.attemptsStore.get(otpId) || 0;
      if (attempts >= this.maxAttempts) {
        this.otpStore.delete(otpId);
        this.attemptsStore.delete(otpId);
        return {
          success: false,
          message: 'Maximum OTP attempts exceeded'
        };
      }

      // Check expiry
      if (Date.now() - otpData.createdAt > this.expiryTime) {
        this.otpStore.delete(otpId);
        this.attemptsStore.delete(otpId);
        return {
          success: false,
          message: 'OTP expired'
        };
      }

      // Increment attempts
      this.attemptsStore.set(otpId, attempts + 1);

      // Verify OTP
      if (otpData.otp === enteredOTP) {
        otpData.verified = true;
        this.otpStore.set(otpId, otpData);

        // Clean up after successful verification
        setTimeout(() => {
          this.otpStore.delete(otpId);
          this.attemptsStore.delete(otpId);
        }, 60000); // Keep for 1 minute after verification

        return {
          success: true,
          message: 'OTP verified successfully'
        };
      } else {
        return {
          success: false,
          message: `Invalid OTP. ${this.maxAttempts - attempts - 1} attempts remaining.`
        };
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'OTP verification failed'
      };
    }
  }

  /**
   * Gets OTP data for debugging (development only)
   * @param {string} otpId - OTP ID
   * @returns {object|null} - OTP data
   */
  getOTPData(otpId) {
    return this.otpStore.get(otpId) || null;
  }
}

// Export singleton instance
export const otpService = new OTPService();
