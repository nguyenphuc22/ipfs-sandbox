/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import AppWithIPFS from './AppWithIPFS';
import {name as appName} from './app.json';

// Switch between different app versions for testing
// AppRegistry.registerComponent(appName, () => App);           // Original app
AppRegistry.registerComponent(appName, () => AppWithIPFS);   // IPFS demo app
