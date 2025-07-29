import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '@/lib/AuthProvider';

function LayoutNavigator() {
  console.log("👟 LayoutNavigator is rendering");

  const { user, isLoading } = useAuth();
  const colorScheme = useColorScheme();

  console.log("🔍 useAuth state:", { user, isLoading });

  if (isLoading) {
    console.log("⏳ Auth context is still loading...");
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {user ? (
          <>
            {console.log("✅ Authenticated user. Rendering tabs...")}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </>
        ) : (
          <>
            {console.log("🚪 Not logged in. Redirecting to login...")}
            <Stack.Screen name="login" options={{ headerShown: false }} />
          </>
        )}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  console.log("🚀 RootLayout is rendering...");

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    console.log("🕐 Fonts not loaded yet...");
    return null;
  }

  console.log("✅ Fonts loaded. Wrapping in AuthProvider...");

  return (
    <AuthProvider>
  <>
    {(() => {
      console.log("✅ AuthProvider is wrapping the app");
      return null;
    })()}
    <LayoutNavigator />
  </>
    </AuthProvider>
  );
}
