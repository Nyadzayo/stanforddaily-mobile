import React, { useState, useEffect, useRef } from "react";
import { View, Text } from "react-native";
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation, { navigationRef } from "./navigation";
import * as Font from 'expo-font';
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, set } from 'firebase/database'
import { getAuth, signInWithCustomToken } from 'firebase/auth'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const firebaseConfig = {
  // This needs to be updated/redacted for security reasons.
  // Planning to use an environment variable.
};

const uid = "" // Also redacted.

export default function App() {
  // const isLoadingComplete = useLoadedAssets();
  // const colorScheme = useColorScheme();

  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    Font.loadAsync({
      // Loads fonts from static resource.
      MinionProDisp: require('./assets/fonts/Minion_Pro/MinionPro-Disp.ttf'),
      MinionProRegular: require('./assets/fonts/Minion_Pro/MinionPro-Regular.ttf'),
      MinionProItDisp: require('./assets/fonts/Minion_Pro/MinionPro-ItDisp.ttf'),
      MinionProBoldDisp: require('./assets/fonts/Minion_Pro/MinionPro-BoldDisp.ttf'),
      MinionProBoldItDisp: require('./assets/fonts/Minion_Pro/MinionPro-BoldItDisp.ttf'),
      MinionProMediumDisp: require('./assets/fonts/Minion_Pro/MinionPro-MediumDisp.ttf'),
      MinionProMediumItDisp: require('./assets/fonts/Minion_Pro/MinionPro-MediumItDisp.ttf'),
      MinionProSemiboldDisp: require('./assets/fonts/Minion_Pro/MinionPro-SemiboldDisp.ttf'),
      MinionProSemiboldItDisp: require('./assets/fonts/Minion_Pro/MinionPro-SemiboldItDisp.ttf'),
      LibreFranklinRegular: require('./assets/fonts/Libre_Franklin/LibreFranklin-Regular.ttf'),
      LibreFranklinBold: require('./assets/fonts/Libre_Franklin/LibreFranklin-Bold.ttf'),
      LibreFranklinItalic: require('./assets/fonts/Libre_Franklin/LibreFranklin-Italic.ttf'),
    }).then(setFontsLoaded(true));
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    if (Object.keys(firebaseConfig).length > 0) {
      const app = initializeApp(firebaseConfig);
      const db = getDatabase(app);
      var matches = expoPushToken.match(/\[(.*?)\]/);
      if (matches) {
        var submatch = matches[1]
        const tokenRef = ref(db, "ExpoPushTokens/" + submatch)
        console.log("Token: ", submatch)
        const auth = getAuth()
        auth.createCustomToken(uid).then((customToken) => {
          console.log("Send token ", customToken)
          signInWithCustomToken(auth, customToken).then((userCredential) => {
            console.log(userCredential)
            set(tokenRef, Date())
          })
        })
        
        // set(tokenRef, Date())
      }
    }

    // This listener is fired whenever a notification is received while the app is foregrounded.
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed).
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response); // Somehow we're gonna get the post ID from this. Can the notification response contain the post item from n8n?
      // navigation.navigate("Home", { item: null }) // How are we going to handle this? Maybe a helper function that gets the item for a single post ID.
      // if (navigationRef.isReady()) {
      //   navigationRef.navigate("Home", null)
      // }
      
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

      return (<SafeAreaProvider>
        <Navigation />
        <StatusBar />
      </SafeAreaProvider>)

}

async function registerForPushNotificationsAsync() {

  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;

}