/**
 * API Configuration for IPFS Sandbox Mobile
 * 
 * This file allows easy switching between different API endpoints
 * without changing code throughout the application.
 */

// =============================================================================
// 🔧 CONFIGURATION: Update this IP address for your development setup
// =============================================================================
// 
// TO GET YOUR IP ADDRESS:
// macOS/Linux: Run `ifconfig | grep "inet " | grep -v "127.0.0.1"`
// Windows: Run `ipconfig` and look for IPv4 Address
//
// UPDATE THE IP BELOW TO MATCH YOUR MACHINE'S IP:
const HOST_MACHINE_IP = '192.168.1.69'; // 👈 CHANGE THIS TO YOUR IP
// =============================================================================

// Development configurations
const DEVELOPMENT_CONFIGS = {
  // For Android Emulator - Use host machine's IP
  ANDROID_EMULATOR: `http://${HOST_MACHINE_IP}:3000`,
  
  // For iOS Simulator - Can use localhost
  IOS_SIMULATOR: 'http://localhost:3000',
  
  // For Physical Devices - Use host machine's IP
  PHYSICAL_DEVICE: `http://${HOST_MACHINE_IP}:3000`,
  
  // Alternative for Emulator (some setups)
  EMULATOR_ALT: 'http://10.0.2.2:3000',
  
  // Localhost (for testing with port forwarding)
  LOCALHOST: 'http://localhost:3000',
};

// Production configuration
const PRODUCTION_CONFIG = {
  BASE_URL: 'https://your-production-domain.com',
};

// Auto-detect platform and environment
const isDevelopment = __DEV__;
const isAndroid = require('react-native').Platform.OS === 'android';
const isIOS = require('react-native').Platform.OS === 'ios';

// Select appropriate configuration
function getApiConfig() {
  if (!isDevelopment) {
    return {
      baseUrl: PRODUCTION_CONFIG.BASE_URL,
      timeout: 30000,
    };
  }

  // Development mode - choose based on your setup
  let baseUrl: string;
  
  if (isAndroid) {
    // Try these in order based on your setup:
    // 1. Host machine IP (most reliable)
    baseUrl = DEVELOPMENT_CONFIGS.ANDROID_EMULATOR;
    
    // 2. Alternative for some emulator setups
    // baseUrl = DEVELOPMENT_CONFIGS.EMULATOR_ALT;
    
    // 3. Localhost (requires adb port forwarding)
    // baseUrl = DEVELOPMENT_CONFIGS.LOCALHOST;
  } else if (isIOS) {
    // iOS simulator can use localhost
    baseUrl = DEVELOPMENT_CONFIGS.IOS_SIMULATOR;
  } else {
    // Fallback
    baseUrl = DEVELOPMENT_CONFIGS.PHYSICAL_DEVICE;
  }

  return {
    baseUrl,
    timeout: 30000,
  };
}

// Export the configuration
export const API_CONFIG = getApiConfig();

// Export all configurations for manual override if needed
export const ALL_CONFIGS = DEVELOPMENT_CONFIGS;

// Helper function to manually set configuration
export function setApiConfig(baseUrl: string) {
  (API_CONFIG as any).baseUrl = baseUrl;
}

// Debug info
console.log('API Configuration:', {
  platform: isAndroid ? 'Android' : isIOS ? 'iOS' : 'Unknown',
  environment: isDevelopment ? 'Development' : 'Production',
  selectedConfig: API_CONFIG,
});