import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert, // 新增 Alert 用于提示权限问题
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications'; // [新增] 引入通知库
import styles from './styles';

// [新增] 配置通知行为：即使 App 在前台，也显示通知
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // 某些旧版本仍需要
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // 允许在屏幕顶部弹出横幅
    shouldShowList: true,   // 允许出现在通知中心列表
  }),
});

const quickTimeOptions = ['08:00', '12:00', '20:00'];

const ReminderSettingsScreen: React.FC = () => {
  const router = useRouter();
  
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const STORAGE_KEY = 'user_reminder_settings';

  // 初始化
  useEffect(() => {
    loadSettings();
    // [可选] 请求权限（也可以放在用户点击开关时请求）
    requestPermissions(); 
  }, []);

  const requestPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      return newStatus === 'granted';
    }
    return true;
  };

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const { enabled, time } = JSON.parse(savedSettings);
        setIsReminderEnabled(enabled);
        setNotificationTime(new Date(time));
      } else {
        const defaultTime = new Date();
        defaultTime.setHours(20, 0, 0, 0);
        setNotificationTime(defaultTime);
      }
    } catch (error) {
      console.error('读取设置失败', error);
    } finally {
      setIsLoading(false);
    }
  };

  // [核心] 调度通知

  const scheduleReminder = async (time: Date) => {
    try {
      // 1. 先取消所有旧的通知
      await Notifications.cancelAllScheduledNotificationsAsync();

      // 2. 设定新的每日提醒
      const triggerHour = time.getHours();
      const triggerMinute = time.getMinutes();

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "该开始正念练习了 🧘",
          body: "给自己几分钟，找回内心的平静。",
          sound: true,
        },
        trigger: {
          // [新增] 显式指定触发器类型为“日历模式”
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: triggerHour,
          minute: triggerMinute,
          repeats: true,
        },
      });
      
      console.log(`通知已设定: 每天 ${triggerHour}:${triggerMinute}`);
    } catch (error) {
      console.error("通知设定失败:", error);
    }
  };

  // [核心] 取消通知
  const cancelReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("所有通知已取消");
  };

  // 保存设置并触发通知逻辑
  const saveSettings = async (enabled: boolean, time: Date) => {
    try {
      // 1. 持久化存储
      const settings = {
        enabled,
        time: time.toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

      // 2. 设置或取消系统通知
      if (enabled) {
        // 检查权限
        const hasPermission = await requestPermissions();
        if (hasPermission) {
          await scheduleReminder(time);
        } else {
          Alert.alert('权限不足', '请在手机设置中允许发送通知，以便接收每日提醒。');
          // 如果没有权限，虽然保存了开启状态，但实际上无法推送，也可以选择在这里把 enabled 设回 false
        }
      } else {
        await cancelReminders();
      }

    } catch (error) {
      console.error('保存设置失败', error);
    }
  };

  const handleBackPress = () => {
    if (router.canGoBack()) router.back();
  };

  const handleReminderToggle = (value: boolean) => {
    setIsReminderEnabled(value);
    saveSettings(value, notificationTime);
  };

  const handleTimeDisplayPress = () => {
    if (isReminderEnabled) {
      setShowPicker(true);
    }
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      setNotificationTime(selectedDate);
      saveSettings(isReminderEnabled, selectedDate);
    }
  };

  const handleQuickTimePress = (timeStr: string) => {
    if (!isReminderEnabled) return;

    const [hours, minutes] = timeStr.split(':').map(Number);
    const newDate = new Date();
    newDate.setHours(hours, minutes, 0, 0);
    
    setNotificationTime(newDate);
    saveSettings(isReminderEnabled, newDate);
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const isQuickTimeSelected = (timeStr: string) => {
    return formatTime(notificationTime) === timeStr;
  };

  if (isLoading) return null;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <FontAwesome6 name="arrow-left" size={18} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>提醒设置</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.reminderCard}>
            <View style={styles.reminderHeader}>
              <View style={styles.reminderInfo}>
                <Text style={styles.reminderTitle}>每日练习提醒</Text>
                <Text style={styles.reminderDescription}>
                  设置每日冥想练习提醒时间
                </Text>
              </View>
              <View style={styles.reminderIcon}>
                <FontAwesome6 name="bell" size={20} color="#f59e0b" />
              </View>
            </View>

            <View style={styles.toggleSection}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleTitle}>开启提醒</Text>
                <Text style={styles.toggleSubtitle}>每日固定时间提醒练习</Text>
              </View>
              <Switch
                value={isReminderEnabled}
                onValueChange={handleReminderToggle}
                trackColor={{ false: '#ccc', true: '#6366f1' }}
                thumbColor="#ffffff"
              />
            </View>

            {/* 时间设置区域 */}
            <View style={styles.timeSection}>
              <View style={styles.timeInfo}>
                <Text style={styles.timeTitle}>提醒时间</Text>
                <Text style={styles.timeSubtitle}>
                  {isReminderEnabled ? '点击下方时间进行修改' : '请先开启提醒'}
                </Text>
              </View>

              <View style={styles.timePickerContainer}>
                <TouchableOpacity
                  style={[
                    styles.timePicker,
                    !isReminderEnabled && styles.timePickerDisabled,
                  ]}
                  onPress={handleTimeDisplayPress}
                  disabled={!isReminderEnabled}
                  activeOpacity={0.7}
                >
                  <View style={styles.selectedTimeDisplay}>
                    <FontAwesome6
                      name="clock"
                      size={20}
                      color={isReminderEnabled ? '#6366f1' : '#6b7280'}
                      style={styles.timeIcon}
                    />
                    <Text
                      style={[
                        styles.selectedTimeText,
                        !isReminderEnabled && styles.selectedTimeTextDisabled,
                      ]}
                    >
                      {formatTime(notificationTime)}
                    </Text>
                  </View>
                  {isReminderEnabled && (
                     <View style={styles.editBadge}>
                        <Text style={styles.editBadgeText}>修改</Text>
                     </View>
                  )}
                </TouchableOpacity>

                {/* 快捷时间选项 */}
                <View style={styles.quickTimes}>
                  {quickTimeOptions.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.quickTimeButton,
                        !isReminderEnabled && styles.quickTimeButtonDisabled,
                        isQuickTimeSelected(time) && styles.quickTimeButtonSelected,
                      ]}
                      onPress={() => handleQuickTimePress(time)}
                      disabled={!isReminderEnabled}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.quickTimeText,
                          !isReminderEnabled && styles.quickTimeTextDisabled,
                          isQuickTimeSelected(time) && styles.quickTimeTextSelected,
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {showPicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={notificationTime}
                  mode="time"
                  is24Hour={true}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                  textColor="#000000" 
                />
              )}
              
              {Platform.OS === 'ios' && showPicker && (
                <View style={styles.iosPickerControl}>
                   <TouchableOpacity 
                     style={styles.iosConfirmButton}
                     onPress={() => setShowPicker(false)}
                   >
                     <Text style={styles.iosConfirmText}>完成设置</Text>
                   </TouchableOpacity>
                </View>
              )}

            </View>
          </View>

          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>提醒详情</Text>
            <View style={styles.detailsList}>
              <View style={styles.detailItem}>
                <View style={[styles.detailIcon, styles.detailIconInfo]}>
                  <FontAwesome6 name="mobile-screen" size={16} color="#3b82f6" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailTitle}>推送通知</Text>
                  <Text style={styles.detailDescription}>
                    在设置时间发送通知
                  </Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <View style={[styles.detailIcon, styles.detailIconSuccess]}>
                  <FontAwesome6 name="repeat" size={16} color="#10b981" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailTitle}>每日重复</Text>
                  <Text style={styles.detailDescription}>
                    每天同一时间自动提醒
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReminderSettingsScreen;