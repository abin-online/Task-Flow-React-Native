import TaskForm from "@/components/todo-app/TaskForm";
import { theme } from "@/components/ui/theme";
import { addTask } from "@/lib/api/auth";
import { Task } from "@/types/Task";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function AddTaskScreen() {
  const router = useRouter();

  const handleAddTask = async (newTask: Task) => {
    try {
      // Save the task
 const savedTask = await addTask(newTask);
console.log(savedTask);

      // Schedule notification
      const dueDate = new Date(newTask.dueDate);
      const now = new Date();
      const secondsUntilDue = Math.floor(
        (dueDate.getTime() - now.getTime()) / 1000
      );

      if (!isNaN(dueDate.getTime()) && secondsUntilDue > 0) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `🕒 Task Reminder: ${newTask.title}`,
            body: newTask.description || "No description available",
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: secondsUntilDue,
            repeats: false,
          },
        });

        console.log(` Notification scheduled in ${secondsUntilDue} seconds`);
      } else {
        console.warn(
          "⚠️ Invalid or past due date. Notification not scheduled."
        );
      }

      router.back();
    } catch (error) {
      console.error(" Saving error:", error);
    }
  };

  return (
    <View style={styles.container}>
  <LinearGradient
  colors={['#4c669f', '#3b5998'] as const}
  style={styles.gradientBackground}
>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="add-circle" size={theme.spacing.xxxl} color={theme.colors.text.primary} />
            </View>
            <Text style={styles.headerTitle}>Task</Text>
            <Text style={styles.headerSubtitle}>
              Stay organized and never miss a deadline
            </Text>
          </View>

          {/* Form Container with Glass Effect */}
          <View style={styles.formContainer}>
            <View style={styles.glassEffect}>
              <TaskForm onSubmit={handleAddTask} />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: theme.spacing.massive + 10,
    paddingBottom: theme.spacing.huge,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xl + 10,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.glass,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
  },
  glassEffect: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.xxl,
    ...theme.shadows.large,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
});