import React from 'react';
import {StyleSheet, View, Platform, Dimensions} from 'react-native';
import {WebView} from 'react-native-webview';
// import SplashScreen from 'react-native-smart-splash-screen';
import DeviceInfo from 'react-native-device-info';

export default function SplashView() {
  const dim = Dimensions.get('window');

  const [state, setstate] = React.useState({
    webviewDisplay: 'flex',
    deviceId: '',
    shouldAddPaddingTopForiPhone: dim.width < dim.height && true,
  });

  const {webviewDisplay, shouldAddPaddingTopForiPhone, deviceId} = state;

  React.useEffect(() => {
    // if (Platform.OS === 'android') {
    //   SplashScreen.close({
    //     animationType: SplashScreen.animationType.scale,
    //     duration: 850,
    //     delay: 500,
    //   });
    // }

    // Check device orientation for iOS
    Dimensions.addEventListener('change', () => {
      setstate({
        ...state,
        shouldAddPaddingTopForiPhone: dim.width < dim.height && true,
      });
    });

    // Getting the Unique Id from here
    if (!state.deviceId) {
      if (Platform.OS === 'ios') {
        setstate({...state, deviceId: DeviceInfo.getUniqueId()});
      } else if (Platform.OS === 'android') {
        DeviceInfo.getAndroidId().then(id => {
          setstate({...state, deviceId: id.toString()});
        });
      }
    }
  }, [dim.height, dim.width, state]);

  const navChanged = () => {};

  const onMessage = () => {
    // const { data } = event.nativeEvent;
  };
  function isIPhoneXAndAbove() {
    return shouldAddPaddingTopForiPhone
      ? dim.height === 812 || dim.height === 896 || dim.height === 926
      : false;
  }

  const expiryDate = new Date();
  expiryDate.setTime(expiryDate.setDate(expiryDate.getDate() + 1));
  const jsCode = `(function () {document.cookie = 'deviceId=${deviceId};expires=${expiryDate};path=/;';})();`;
  return (
    <>
      {Platform.OS === 'ios' && (
        <View
          style={[
            styles.container,
            {
              paddingTop: isIPhoneXAndAbove() ? 52 : 22,
              backgroundColor: 'white',
              zIndex: 1,
            },
          ]}>
          <WebView
            source={{
              uri: 'https://sba-secure.dwellant.com/Account/SignInOrRegister',
            }}
            style={[styles.WebViewStyle, {display: webviewDisplay, zIndex: 2}]}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            onNavigationStateChange={navChanged}
            injectedJavaScript={jsCode}
          />
        </View>
      )}
      {Platform.OS === 'android' && (
        <View style={styles.container}>
          <WebView
            source={{
              uri: 'https://sba-secure.dwellant.com/Account/SignInOrRegister',
            }}
            style={[styles.WebViewStyle, {display: webviewDisplay}]}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            onNavigationStateChange={navChanged}
            onMessage={onMessage}
            injectedJavaScript={jsCode}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f4ef',
    position: 'relative',
  },
  WebViewStyle: {
    backgroundColor: 'transparent',
    flex: 1,
  },
});
