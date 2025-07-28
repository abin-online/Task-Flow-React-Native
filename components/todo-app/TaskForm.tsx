import { Task } from '@/types/Task';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type TaskFormProps = {
  initialValues?: Task;
  onSubmit: (task: Task) => void;
};

export default function TaskForm({ initialValues, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [date, setDate] = useState(
    initialValues?.dueDate ? new Date(initialValues.dueDate) : new Date()
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Title cannot be empty 💀');
      return;
    }

    const now = new Date();
    if (date <= now) {
      Alert.alert('Invalid Date', 'Due date and time must be in the future ⏳');
      return;
    }

    const newTask: Task = {
      id: initialValues?.id,
      title,
      description,
      dueDate: date.toISOString(),
      completed: initialValues?.completed ?? false,
    };

    onSubmit(newTask);
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setDate(newDate);
    }
  };

  const handleTimeChange = (_: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.iconTitleContainer}>
          <Ionicons name="document-text" size={24} color="#667eea" />
          <Text style={styles.heading}>Task Details</Text>
        </View>
      </View>

      {/* Title Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputHeader}>
          <Ionicons name="create-outline" size={20} color="#667eea" />
          <Text style={styles.inputLabel}>Title</Text>
        </View>
        <TextInput
          placeholder="Enter task title..."
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#999"
        />
      </View>

      {/* Description Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputHeader}>
          <Ionicons name="list-outline" size={20} color="#667eea" />
          <Text style={styles.inputLabel}>Description</Text>
        </View>
        <TextInput
          placeholder="Add a description (optional)..."
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          placeholderTextColor="#999"
          textAlignVertical="top"
        />
      </View>

      {/* Date & Time Selectors */}
      <View style={styles.dateTimeContainer}>
        <Text style={styles.sectionTitle}>Schedule</Text>
        
        <View style={styles.dateTimeRow}>
          {/* Date Picker */}
          <Pressable 
            style={styles.dateTimeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <View style={styles.dateTimeContent}>
              <Ionicons name="calendar-outline" size={20} color="#667eea" />
              <View style={styles.dateTimeText}>
                <Text style={styles.dateTimeLabel}>Date</Text>
                <Text style={styles.dateTimeValue}>
                  {date.toLocaleDateString()}
                </Text>
              </View>
            </View>
          </Pressable>

          {/* Time Picker */}
          <Pressable 
            style={styles.dateTimeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <View style={styles.dateTimeContent}>
              <Ionicons name="time-outline" size={20} color="#667eea" />
              <View style={styles.dateTimeText}>
                <Text style={styles.dateTimeLabel}>Time</Text>
                <Text style={styles.dateTimeValue}>
                  {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Date/Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButtonContainer}
        onPress={handleSubmit}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.submitButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons 
            name={initialValues ? "checkmark-circle" : "add-circle"} 
            size={20} 
            color="#fff" 
          />
          <Text style={styles.submitButtonText}>
            {initialValues ? 'Update Task' : 'Create Task'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },
  headerSection: {
    marginBottom: 8,
  },
  iconTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d3748',
  },
  inputContainer: {
    gap: 8,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#f7fafc',
    color: '#2d3748',
  },
  textArea: {
    minHeight: 80,
    paddingTop: 16,
  },
  dateTimeContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 4,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  dateTimeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateTimeText: {
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#718096',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateTimeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginTop: 2,
  },
  submitButtonContainer: {
    marginTop: 20,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});