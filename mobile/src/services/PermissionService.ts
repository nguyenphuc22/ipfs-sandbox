import {Platform} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
} from 'react-native-permissions';
import {PermissionStatus, PermissionResult} from '../types/filePicker';

export class PermissionService {
  private static instance: PermissionService;

  static getInstance(): PermissionService {
    if (!PermissionService.instance) {
      PermissionService.instance = new PermissionService();
    }
    return PermissionService.instance;
  }

  private mapPermissionResult(result: any): PermissionStatus {
    const canAskAgain = result !== RESULTS.BLOCKED;

    switch (result) {
      case RESULTS.GRANTED:
        return {
          granted: true,
          canAskAgain,
          status: 'granted',
        };
      case RESULTS.DENIED:
        return {
          granted: false,
          canAskAgain,
          status: 'denied',
        };
      case RESULTS.BLOCKED:
        return {
          granted: false,
          canAskAgain: false,
          status: 'blocked',
        };
      case RESULTS.UNAVAILABLE:
        return {
          granted: false,
          canAskAgain: false,
          status: 'unavailable',
        };
      case RESULTS.LIMITED:
        return {
          granted: true,
          canAskAgain,
          status: 'limited',
        };
      default:
        return {
          granted: false,
          canAskAgain: false,
          status: 'unavailable',
        };
    }
  }

  private getCameraPermission(): Permission | null {
    if (Platform.OS === 'ios') {
      return PERMISSIONS.IOS.CAMERA;
    } else if (Platform.OS === 'android') {
      return PERMISSIONS.ANDROID.CAMERA;
    }
    return null;
  }

  private getPhotoLibraryPermission(): Permission | null {
    if (Platform.OS === 'ios') {
      return PERMISSIONS.IOS.PHOTO_LIBRARY;
    } else if (Platform.OS === 'android') {
      // Android 13+ doesn't require READ_EXTERNAL_STORAGE for document picker
      if (Platform.Version >= 33) {
        return PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
      }
      return PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    }
    return null;
  }

  async checkCameraPermission(): Promise<PermissionStatus> {
    const permission = this.getCameraPermission();
    if (!permission) {
      return {
        granted: true, // Assume granted if permission not needed
        canAskAgain: false,
        status: 'unavailable',
      };
    }

    try {
      const result = await check(permission);
      return this.mapPermissionResult(result);
    } catch (error) {
      return {
        granted: false,
        canAskAgain: false,
        status: 'unavailable',
      };
    }
  }

  async requestCameraPermission(): Promise<PermissionStatus> {
    const permission = this.getCameraPermission();
    if (!permission) {
      return {
        granted: true,
        canAskAgain: false,
        status: 'unavailable',
      };
    }

    try {
      const result = await request(permission);
      return this.mapPermissionResult(result);
    } catch (error) {
      return {
        granted: false,
        canAskAgain: false,
        status: 'unavailable',
      };
    }
  }

  async checkPhotoLibraryPermission(): Promise<PermissionStatus> {
    const permission = this.getPhotoLibraryPermission();
    if (!permission) {
      return {
        granted: true, // Document picker doesn't need permissions on modern Android
        canAskAgain: false,
        status: 'unavailable',
      };
    }

    try {
      const result = await check(permission);
      return this.mapPermissionResult(result);
    } catch (error) {
      return {
        granted: false,
        canAskAgain: false,
        status: 'unavailable',
      };
    }
  }

  async requestPhotoLibraryPermission(): Promise<PermissionStatus> {
    const permission = this.getPhotoLibraryPermission();
    if (!permission) {
      return {
        granted: true,
        canAskAgain: false,
        status: 'unavailable',
      };
    }

    try {
      const result = await request(permission);
      return this.mapPermissionResult(result);
    } catch (error) {
      return {
        granted: false,
        canAskAgain: false,
        status: 'unavailable',
      };
    }
  }

  async checkAllPermissions(): Promise<PermissionResult> {
    const [camera, photoLibrary] = await Promise.all([
      this.checkCameraPermission(),
      this.checkPhotoLibraryPermission(),
    ]);

    return {
      camera,
      photoLibrary,
    };
  }

  async requestAllPermissions(): Promise<PermissionResult> {
    const [camera, photoLibrary] = await Promise.all([
      this.requestCameraPermission(),
      this.requestPhotoLibraryPermission(),
    ]);

    return {
      camera,
      photoLibrary,
    };
  }

  isDocumentPickerPermissionRequired(): boolean {
    // Document picker generally doesn't require special permissions
    // except for specific cases like accessing camera on iOS
    return false;
  }

  isImagePickerPermissionRequired(): boolean {
    // Image picker from gallery typically requires photo library permission
    return true;
  }

  isCameraPermissionRequired(): boolean {
    // Camera access always requires permission
    return true;
  }

  async ensureDocumentPickerPermissions(): Promise<boolean> {
    // Most document pickers don't require special permissions
    return true;
  }

  async ensureImagePickerPermissions(): Promise<boolean> {
    const photoLibraryStatus = await this.checkPhotoLibraryPermission();

    if (photoLibraryStatus.granted) {
      return true;
    }

    if (photoLibraryStatus.canAskAgain) {
      const requestResult = await this.requestPhotoLibraryPermission();
      return requestResult.granted;
    }

    return false;
  }

  async ensureCameraPermissions(): Promise<boolean> {
    const cameraStatus = await this.checkCameraPermission();

    if (cameraStatus.granted) {
      return true;
    }

    if (cameraStatus.canAskAgain) {
      const requestResult = await this.requestCameraPermission();
      return requestResult.granted;
    }

    return false;
  }
}
