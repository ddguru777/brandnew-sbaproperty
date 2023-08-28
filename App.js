import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Dimensions,
  SafeAreaView,
  Linking,
  AppState,
  ActivityIndicator,
} from 'react-native';
import {WebView} from 'react-native-webview';
import DeviceInfo from 'react-native-device-info';
import {
  getTrackingStatus,
  requestTrackingPermission,
} from 'react-native-tracking-transparency';

const DOMAIN_URL = 'https://sba-secure.dwellant.com';
const SIGNIN_URL = DOMAIN_URL + '/Account/SignInOrRegister';

export default function SplashView() {
  const dim = Dimensions.get('window');

  const [state, setState] = useState({
    webviewDisplay: 'flex',
    deviceId: '',
    shouldAddPaddingTopForiPhone: dim.width < dim.height && true,
  });
  const [jsCode, setJsCode] = useState('');
  const [isLoading, setLoading] = useState(true);

  const {webviewDisplay, deviceId} = state;

  useEffect(() => {
    // Check device orientation for iOS
    Dimensions.addEventListener('change', () => {
      setState({
        ...state,
        shouldAddPaddingTopForiPhone: dim.width < dim.height && true,
      });
    });

    // Getting the Unique Id from here
    if (!state.deviceId) {
      if (Platform.OS === 'ios') {
        setState({...state, deviceId: DeviceInfo.getUniqueId().toString()});
      } else if (Platform.OS === 'android') {
        DeviceInfo.getAndroidId().then(id => {
          setState({...state, deviceId: id.toString()});
        });
      }
    }
  }, [dim.height, dim.width, state]);

  useEffect(() => {
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.setDate(expiryDate.getDate() + 1));
    const code = `(function () {document.cookie = 'deviceId=${deviceId};expires=${expiryDate};path=/;';})();`;

    if (Platform.OS === 'ios') {
      const listener = AppState.addEventListener('change', status => {
        if (status === 'active') {
          (async () => {
            const trackingStatus = await getTrackingStatus();
            if (trackingStatus === 'not-determined') {
              const retStatus = await requestTrackingPermission();
              if (retStatus === 'authorized') {
                // enable tracking features
                setJsCode(code);
              }
            }
          })();
        }
      });
      return () => {
        listener && listener.remove();
      };
    } else {
      setJsCode(code);
    }
  }, [deviceId]);

  const externalLinkHandler = event => {
    if (!event.url.includes(DOMAIN_URL)) {
      Linking.openURL(event.url);
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.activityContainer}>
          <ActivityIndicator size="large" color="rgba(144, 112, 44, 1.0)" />
        </View>
      )}
      {Platform.OS === 'ios' && <SafeAreaView />}
      <WebView
        source={{
          uri: SIGNIN_URL,
        }}
        onLoad={() => {
          setLoading(false);
        }}
        style={[styles.WebViewStyle, {display: webviewDisplay}]}
        javaScriptEnabled
        domStorageEnabled
        injectedJavaScript={jsCode}
        onShouldStartLoadWithRequest={externalLinkHandler}
        allowsBackForwardNavigationGestures={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebe9df',
    position: 'relative',
  },
  WebViewStyle: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  activityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    height: '100%',
    width: '100%',
    zIndex: 9,
  },
});
