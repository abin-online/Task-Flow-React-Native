import { theme } from "@/components/ui/theme";
import { verifyOTP } from "@/lib/api/auth";
import { useAuth } from "@/lib/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function OTPVerificationScreen() {
  const router = useRouter();
  const { loginUser }  = useAuth()
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Refs for each input
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      Alert.alert("Error", "Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      const email = await AsyncStorage.getItem("signupEmail");

      if (!email) {
        Alert.alert("No email found");
        return;
      }
      const payload = {
        email,
        otp: otpString,
      };

      const response = await verifyOTP(payload);
      console.log(response);

    const { accessToken, refreshToken, user } = response;

    // Store tokens securely

     await loginUser(user, accessToken, refreshToken );

      Alert.alert("Success", "OTP verified successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/"),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Invalid OTP or verification failed.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackNavigation = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#4c669f", "#000000ff"] as const}
        style={styles.gradientBackground}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackNavigation}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons
                name="shield-checkmark"
                size={50}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.appName}>Verify OTP</Text>
            <Text style={styles.tagline}>Enter the verification code</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.instructionTitle}>Enter Verification Code</Text>
          <Text style={styles.instructionSubtitle}>
            We've sent a 6-digit verification code to your email address. Please
            enter it below to verify your account.
          </Text>

          {/* OTP Input Section */}
          <View style={styles.otpSection}>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <View key={index} style={styles.otpInputWrapper}>
                  <TextInput
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    style={[
                      styles.otpInput,
                      digit !== "" && styles.otpInputFilled,
                    ]}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    selectTextOnFocus
                    textAlign="center"
                    autoFocus={index === 0}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              otp.join("").length !== 6 && styles.verifyButtonDisabled,
            ]}
            onPress={handleVerifyOTP}
            disabled={isLoading || otp.join("").length !== 6}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                otp.join("").length === 6
                  ? [theme.colors.primary, "#3b82f6"]
                  : ["#6b7280", "#9ca3af"]
              }
              style={styles.verifyButtonGradient}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <View style={styles.loadingSpinner} />
                  <Text style={styles.verifyButtonText}>Verifying...</Text>
                </View>
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                  <Text style={styles.verifyButtonText}>Verify OTP</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Help Section */}
          <View style={styles.helpSection}>
            <View style={styles.helpContainer}>
              <Text style={styles.helpTitle}>Having trouble?</Text>
              <View style={styles.helpList}>
                <View style={styles.helpItem}>
                  <Ionicons
                    name="information-circle-outline"
                    size={16}
                    color={theme.colors.text.secondary}
                  />
                  <Text style={styles.helpText}>
                    Check your spam/junk folder
                  </Text>
                </View>
                <View style={styles.helpItem}>
                  <Ionicons
                    name="information-circle-outline"
                    size={16}
                    color={theme.colors.text.secondary}
                  />
                  <Text style={styles.helpText}>
                    Make sure you entered the correct email
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Having trouble? Please check your email for the verification code.
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xxl,
    alignItems: "center",
    position: "relative",
    flex: 0.25,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: theme.spacing.xxl,
    top: theme.spacing.lg,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceTransparent,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.surfaceTransparent,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.large,
  },
  appName: {
    fontSize: 32,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    textAlign: "center",
    fontWeight: theme.typography.weights.normal,
  },
  contentSection: {
    flex: 0.75,
    paddingHorizontal: theme.spacing.xxl,
    justifyContent: "flex-start",
  },
  instructionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  instructionSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: theme.typography.weights.normal,
    marginBottom: theme.spacing.xxl,
  },
  otpSection: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  otpInputWrapper: {
    backgroundColor: theme.colors.surfaceTransparent,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  otpInput: {
    width: 45,
    height: 55,
    fontSize: 20,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    backgroundColor: "transparent",
    borderRadius: theme.borderRadius.lg,
  },
  otpInputFilled: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "10",
  },
  verifyButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    marginBottom: theme.spacing.xl,
    ...theme.shadows.medium,
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.lg + 2,
    paddingHorizontal: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderTopColor: "#ffffff",
    // Note: In a real app, you'd use an animated component for rotation
  },
  verifyButtonText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: "#ffffff",
  },
  helpSection: {
    flex: 1,
  },
  helpContainer: {
    backgroundColor: theme.colors.surfaceTransparent,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  helpTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  helpList: {
    gap: theme.spacing.xs,
  },
  helpItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  helpText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.normal,
    flex: 1,
  },
  footer: {
    paddingHorizontal: theme.spacing.xxl,
    paddingBottom: theme.spacing.lg,
    alignItems: "center",
  },
  footerText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: 16,
    fontWeight: theme.typography.weights.normal,
  },
});
