import { Task } from "@/types/Task";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onDelete,
  onToggleStatus,
}) => {
  const handleDelete = () => {
    Alert.alert(
      "Delete Task",
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => onDelete(task.id as string),
          style: "destructive",
        },
      ]
    );
  };

  const handleToggleStatus = () => {
    onToggleStatus(task.id as string);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isOverdue = date < now && !task.completed;

    return {
      formatted: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOverdue,
    };
  };

  const { formatted: formattedDate, isOverdue } = formatDate(task.dueDate);

  return (
    <View
      style={[
        styles.taskItem,
        task.completed && styles.completedTask,
        isOverdue && !task.completed && styles.overdueTask,
      ]}
    >
      {/* Task Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <TouchableOpacity
            style={[
              styles.statusIndicator,
              task.completed && styles.completedIndicator,
            ]}
            onPress={handleToggleStatus}
          >
            <Ionicons
              name={task.completed ? "checkmark-circle" : "ellipse-outline"}
              size={24}
              color={task.completed ? "#10b981" : "#6b7280"}
            />
          </TouchableOpacity>
          <Text style={[styles.title, task.completed && styles.completedTitle]}>
            {task.title}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleDelete}
          style={styles.deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* Description */}
      {task.description && (
        <Text
          style={[styles.description, task.completed && styles.completedText]}
        >
          {task.description}
        </Text>
      )}

      {/* Footer with Date and Status */}
      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Ionicons
            name={isOverdue && !task.completed ? "warning" : "calendar-outline"}
            size={16}
            color={isOverdue && !task.completed ? "#ef4444" : "#6b7280"}
          />
          <Text
            style={[
              styles.date,
              isOverdue && !task.completed && styles.overdueText,
              task.completed && styles.completedText,
            ]}
          >
            {isOverdue && !task.completed ? "Overdue: " : "Due: "}
            {formattedDate}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleToggleStatus}
          style={[
            styles.statusButton,
            task.completed && styles.completedStatusButton,
          ]}
        >
          <LinearGradient
            colors={
              task.completed ? ["#10b981", "#059669"] : ["#6366f1", "#4f46e5"]
            }
            style={styles.statusGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons
              name={task.completed ? "checkmark" : "time"}
              size={14}
              color="#fff"
            />
            <Text style={styles.statusText}>
              {task.completed ? "Completed" : "Pending"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
  taskItem: {
    backgroundColor: "#ffffff",
    marginVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#6366f1",
  },
  completedTask: {
    backgroundColor: "#f0fdf4",
    borderLeftColor: "#10b981",
    opacity: 0.85,
  },
  overdueTask: {
    backgroundColor: "#fef2f2",
    borderLeftColor: "#ef4444",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  statusIndicator: {
    padding: 2,
  },
  completedIndicator: {
    transform: [{ scale: 1.1 }],
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    flex: 1,
    lineHeight: 24,
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: "#6b7280",
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#fef2f2",
  },
  description: {
    fontSize: 15,
    color: "#4b5563",
    lineHeight: 22,
    marginBottom: 16,
    marginLeft: 36,
  },
  completedText: {
    color: "#9ca3af",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  date: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  overdueText: {
    color: "#ef4444",
    fontWeight: "600",
  },
  statusButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  completedStatusButton: {
    // No additional styles needed, handled by gradient colors
  },
  statusGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
