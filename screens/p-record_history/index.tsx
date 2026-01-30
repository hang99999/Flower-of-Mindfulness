import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import StatsCard from './components/StatsCard';
import RecordItem from './components/RecordItem';

// 定义从存储中读取的原始数据结构
interface StorageRecordData {
  id: string;
  createdAt: string;
  displayTime: string;
  duration: number | null;
  anxietyRating: number;
  description: string;
  tags: string[];
}

// UI 显示用的数据结构
interface RecordData {
  id: string;
  date: string;
  time: string;
  duration: number;
  anxietyLevel: number;
  practiceType: string;
  feeling: string;
  iconType: 'headphones' | 'heart';
}

interface StatsData {
  totalPracticeCount: number;
  totalPracticeTime: number;
  weekProgress: {
    completedDays: number;
    totalDays: number;
    dailyProgress: boolean[];
  };
}

const RecordHistoryScreen: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [records, setRecords] = useState<RecordData[]>([]);
  
  // 初始统计数据
  const [statsData, setStatsData] = useState<StatsData>({
    totalPracticeCount: 0,
    totalPracticeTime: 0,
    weekProgress: {
      completedDays: 0,
      totalDays: 7,
      dailyProgress: [false, false, false, false, false, false, false],
    },
  });

  // 格式化日期辅助函数
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // 格式化时间辅助函数
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('zh-CN', { hour: 'numeric', minute: '2-digit' });
  };

  // [核心逻辑] 计算统计数据 (已修复周进度逻辑)
  const calculateStats = (currentRecords: RecordData[]) => {
    // 1. 总次数 (只统计时长 > 5 分钟的有效练习)
    const validRecords = currentRecords.filter(r => r.duration > 5);
    const totalCount = validRecords.length;

    // 2. 总时长 
    const totalTime = currentRecords.reduce((sum, item) => sum + item.duration, 0);

    // 3. 周进度 (锁定显示本周一到本周日)
    const today = new Date();
    // 获取今天是周几 (0是周日, 1-6是周一到周六)
    const currentDay = today.getDay();
    
    // 计算距离本周一差几天。
    // 如果今天是周日(0)，则距离周一6天；如果是周一(1)，距离0天；如果是周二(2)，距离1天
    const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;
    
    // 算出本周一的具体日期
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() - diffToMonday);

    const weekProgressArray = Array(7).fill(false);
    let activeDaysInWeek = 0;

    for (let i = 0; i < 7; i++) {
        // 从周一依次往后推算日期 (周一, 周二 ... 周日)
        const targetDate = new Date(thisMonday);
        targetDate.setDate(thisMonday.getDate() + i);
        
        // 格式化为与记录一致的字符串格式
        const dStr = targetDate.toLocaleDateString('zh-CN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        // 检查这一天是否有有效记录
        // 这里的逻辑是：只要 records 里有日期等于 targetDate 的，这天的灯就亮
        const isDayCompleted = validRecords.some(record => record.date === dStr);
        
        weekProgressArray[i] = isDayCompleted;
        if (isDayCompleted) activeDaysInWeek++;
    }

    return {
      totalPracticeCount: totalCount,
      totalPracticeTime: totalTime,
      weekProgress: {
        completedDays: activeDaysInWeek,
        totalDays: 7,
        dailyProgress: weekProgressArray,
      },
    };
  };
  
  const loadRecordsData = async () => {
    try {
      setIsLoading(true);
      
      const jsonValue = await AsyncStorage.getItem('user_practice_records');
      let storageRecords: StorageRecordData[] = [];
      
      if (jsonValue != null) {
        storageRecords = JSON.parse(jsonValue);
      }

      const mappedRecords: RecordData[] = storageRecords.map(item => ({
        id: item.id,
        date: formatDate(item.createdAt),
        time: formatTime(item.createdAt),
        duration: item.duration || 0,
        anxietyLevel: item.anxietyRating,
        practiceType: (item.tags && item.tags.length > 0) ? item.tags[0] : '自由练习', 
        feeling: item.description || '没有填写具体的感受。',
        iconType: (item.duration && item.duration > 0) ? 'headphones' : 'heart',
      }));

      setRecords(mappedRecords);

      const newStats = calculateStats(mappedRecords);
      setStatsData(newStats);

    } catch (error) {
      console.error('加载记录失败:', error);
      Alert.alert('错误', '加载数据失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRecordsData();
    }, [])
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadRecordsData();
    setIsRefreshing(false);
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleRecordItemPress = (recordId: string) => {
    // router.push(`/p-record_detail/${recordId}`);
  };

  const handleStartPracticePress = () => {
    router.push('/p-record_edit'); 
  };

  const renderLoadingIndicator = () => (
    <View style={styles.loadingContainer}>
      <View style={styles.loadingSpinner} />
      <Text style={styles.loadingText}>加载数据中...</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyIconContainer}>
        <FontAwesome6 name="book-open" size={32} color="#9CA3AF" />
      </View>
      <Text style={styles.emptyTitle}>还没有记录</Text>
      <Text style={styles.emptyDescription}>
        开始你的第一次练习，记录当下的感受
      </Text>
      <TouchableOpacity
        style={styles.startPracticeButton}
        onPress={handleStartPracticePress}
        activeOpacity={0.8}
      >
        <Text style={styles.startPracticeButtonText}>去记录</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRecordsList = () => (
    <View style={styles.recordsListContainer}>
      {records.map((record) => (
        <RecordItem
          key={record.id}
          record={record}
          onPress={() => handleRecordItemPress(record.id)}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#6366F1']}
            tintColor="#6366F1"
          />
        }
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <FontAwesome6 name="arrow-left" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.titleSection}>
              <Text style={styles.pageTitle}>历史记录</Text>
              <Text style={styles.pageSubtitle}>回顾你的冥想之旅</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.statsSection}>
          <StatsCard statsData={statsData} />
        </View>

        <View style={styles.recordsSection}>
          <View style={styles.recordsHeader}>
            <Text style={styles.recordsTitle}>练习记录</Text>
            <Text style={styles.recordsCount}>共 {records.length} 条记录</Text>
          </View>

          {isLoading ? (
            renderLoadingIndicator()
          ) : records.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              {renderRecordsList()}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecordHistoryScreen;