

import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface StatsData {
  totalPracticeCount: number;
  totalPracticeTime: number;
  weekProgress: {
    completedDays: number;
    totalDays: number;
    dailyProgress: boolean[];
  };
}

interface StatsCardProps {
  statsData: StatsData;
}

const StatsCard: React.FC<StatsCardProps> = ({ statsData }) => {
  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

  const renderWeekCalendar = () => (
    <View style={styles.weekCalendar}>
      {statsData.weekProgress.dailyProgress.map((isCompleted, index) => (
        <View key={index} style={styles.dayContainer}>
          <View
            style={[
              styles.dayCircle,
              isCompleted ? styles.dayCompleted : styles.dayIncomplete,
            ]}
          >
            {isCompleted && (
              <FontAwesome6 name="check" size={10} color="#FFFFFF" />
            )}
          </View>
          <Text style={styles.dayLabel}>{weekDays[index]}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>练习统计</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{statsData.totalPracticeCount}</Text>
          <Text style={styles.statLabel}>总练习次数</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumberSecondary}>
            {statsData.totalPracticeTime}
          </Text>
          <Text style={styles.statLabel}>总练习时长(分钟)</Text>
        </View>
      </View>

      <View style={styles.weekStats}>
        <View style={styles.weekStatsHeader}>
          <Text style={styles.weekStatsTitle}>本周练习</Text>
          <Text style={styles.weekProgress}>
            {statsData.weekProgress.completedDays}/{statsData.weekProgress.totalDays} 天
          </Text>
        </View>
        {renderWeekCalendar()}
      </View>
    </View>
  );
};

export default StatsCard;

