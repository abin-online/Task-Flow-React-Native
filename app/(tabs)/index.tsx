import TaskItem from "@/components/todo-app/TaskItem";
import { theme } from "@/components/ui/theme";
import { deleteTask, getTasks, toggleTaskStatus } from "@/lib/api/auth";
import { useAuth } from "@/lib/AuthProvider";
import { Task } from "@/types/Task";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ColorValue,
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { user, logoutUser } = useAuth();

    useEffect(() => {
    if (!user) {
      console.log("🔀 Redirecting to tabs");
      router.replace("/login");
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logoutUser();
              router.navigate('/login')
              console.log("👋 Logged out");
            } catch (err) {
              console.error("❌ Logout failed", err);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleAddTaskPress = () => {
    if (user) {
      router.push("/add-task");
    } else {
      router.push("/login");
    }
  };

  const [tasks, setTasks] = useState<Task[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchTasks = async () => {
        try {
          if (!user) {
            console.log("👻 No user found. Skipping task fetch.");
            return;
          }
          const tasksFromServer = await getTasks();
          setTasks(tasksFromServer);
          console.log("📥 Tasks loaded on focus:", tasksFromServer);
        } catch (err) {
          console.error("❌ Failed to load tasks:", err);
        }
      };

      fetchTasks();
    }, [])
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      const updated = tasks.filter((t: any) => t.id !== id);
      setTasks(updated);
      console.log(`🗑️ Task ${id} deleted from backend`);
    } catch (err) {
      console.error("❌ Error deleting task:", err);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const updatedTask = await toggleTaskStatus(id);
      console.log(updatedTask)
      const updated = tasks.map((task: any) =>
        task.id === id ? updatedTask : task
      );
      setTasks(updated);
    } catch (err) {
      console.error("❌ Error toggling task status:", err);
    }
  };

  // Calculate task statistics
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const overdueTasks = tasks.filter((task) => {
    const dueDate = new Date(task.dueDate);
    return dueDate < new Date() && !task.completed;
  }).length;

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons
          name="checkmark-circle-outline"
          size={80}
          color={theme.colors.text.secondary}
        />
      </View>
      <Text style={styles.emptyTitle}>No Tasks Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start by creating your first task to stay organized and productive
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#4c669f", "#000000ff"] as const}
        style={styles.gradientBackground}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.titleContainer}>
                <Ionicons
                  name="checkmark-done-circle"
                  size={theme.spacing.xxxl}
                  color={theme.colors.primary}
                />
                <Text style={styles.heading}>TaskFlow</Text>
              </View>

              {user ? (
                <Pressable style={styles.loginButton} onPress={handleLogout}>
                  <Ionicons
                    name="log-out-outline"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.loginText}>{user.name ?? "Logout"}</Text>
                </Pressable>
              ) : (
                <Link href="/login" asChild>
                  <Pressable style={styles.loginButton}>
                    <Ionicons
                      name="person-circle-outline"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.loginText}>LOGIN</Text>
                  </Pressable>
                </Link>
              )}
            </View>

            <Text style={styles.subtitle}>Stay organized, stay productive</Text>
          </View>

          {/* Statistics Cards */}
          {tasks.length > 0 && (
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Ionicons
                    name="list-outline"
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={styles.statNumber}>{tasks.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>

              <View style={styles.statCard}>
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: `${theme.colors.success}15` },
                  ]}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color={theme.colors.success}
                  />
                </View>
                <Text
                  style={[styles.statNumber, { color: theme.colors.success }]}
                >
                  {completedTasks}
                </Text>
                <Text style={styles.statLabel}>Done</Text>
              </View>

              <View style={styles.statCard}>
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: `${theme.colors.warning}15` },
                  ]}
                >
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={theme.colors.warning}
                  />
                </View>
                <Text
                  style={[styles.statNumber, { color: theme.colors.warning }]}
                >
                  {pendingTasks}
                </Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>

              {overdueTasks > 0 && (
                <View style={styles.statCard}>
                  <View
                    style={[
                      styles.statIconContainer,
                      { backgroundColor: `${theme.colors.error}15` },
                    ]}
                  >
                    <Ionicons
                      name="alert-circle-outline"
                      size={20}
                      color={theme.colors.error}
                    />
                  </View>
                  <Text
                    style={[styles.statNumber, { color: theme.colors.error }]}
                  >
                    {overdueTasks}
                  </Text>
                  <Text style={styles.statLabel}>Overdue</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Add Task Button */}
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButtonWrapper}
            activeOpacity={0.8}
            onPress={handleAddTaskPress}
          >
            <LinearGradient
              colors={theme.colors.gradients.button as [ColorValue, ColorValue]}
              style={styles.addButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons
                name="add"
                size={theme.spacing.xxl}
                color={theme.colors.text.primary}
              />
              <Text style={styles.addButtonText}>Create New Task</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Tasks List */}
        <View style={styles.tasksContainer}>
          {tasks.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <View style={styles.tasksHeader}>
                <Text style={styles.tasksTitle}>Your Tasks</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${
                            tasks.length > 0
                              ? (completedTasks / tasks.length) * 100
                              : 0
                          }%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {tasks.length > 0
                      ? Math.round((completedTasks / tasks.length) * 100)
                      : 0}
                    % Complete
                  </Text>
                </View>
              </View>

              <ScrollView
                style={styles.tasksList}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.tasksListContent}
              >
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </ScrollView>
            </>
          )}
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
    paddingHorizontal: theme.spacing.xxl,
    paddingTop: theme.spacing.massive,
    paddingBottom: theme.spacing.xxl,
  },
  headerContent: {
    marginBottom: theme.spacing.xl,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: theme.spacing.sm,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  heading: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.normal,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${theme.colors.primary}10`,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.lg,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}30`,
  },
  loginText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: "600",
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface || "#ffffff",
    borderRadius: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${theme.colors.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  statNumber: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  addButtonContainer: {
    paddingHorizontal: theme.spacing.xxl,
    marginBottom: theme.spacing.xxl,
  },
  addButtonWrapper: {
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.lg + 2,
    paddingHorizontal: theme.spacing.xxl,
    gap: theme.spacing.md,
    ...theme.shadows.button,
  },
  addButtonText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  tasksContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xxl,
    borderTopRightRadius: theme.borderRadius.xxl,
    paddingTop: theme.spacing.xxl,
  },
  tasksHeader: {
    paddingHorizontal: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },
  tasksTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.dark,
    marginBottom: theme.spacing.lg,
  },
  progressContainer: {
    gap: theme.spacing.sm,
  },
  progressBar: {
    height: theme.spacing.sm,
    backgroundColor: theme.colors.progressBackground,
    borderRadius: theme.spacing.xs,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.success,
    borderRadius: theme.spacing.xs,
  },
  progressText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.gray,
    textAlign: "right",
  },
  tasksList: {
    flex: 1,
  },
  tasksListContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.huge,
  },
  emptyIconContainer: {
    marginBottom: theme.spacing.xxl,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.lightGray,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.gray,
    textAlign: "center",
    lineHeight: theme.spacing.xxl,
  },
});
