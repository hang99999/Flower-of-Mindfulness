// p-record_history/components/RecordItem/index.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles'; // 引用上面的那个新文件

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface RecordItemProps {
  record: {
    id: string;
    date: string;
    time: string;
    duration: number;
    anxietyLevel: number;
    practiceType: string;
    feeling: string;
    iconType: 'headphones' | 'heart';
  };
  onPress?: () => void;
}

const RecordItem: React.FC<RecordItemProps> = ({ record, onPress }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getAnxietyColor = (score: number) => {
    if (score <= 2) return '#10b981'; 
    if (score <= 4) return '#f59e0b'; 
    if (score <= 6) return '#f97316'; 
    return '#ef4444'; 
  };

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity 
      style={styles.recordCard} 
      onPress={handlePress} 
      activeOpacity={0.7}
    >
      <View style={styles.cardTopRow}>
        <View style={styles.dateContainer}>
          <FontAwesome6 name="calendar-alt" size={14} color="#6366f1" />
          <Text style={styles.dateText}>
            {record.date} <Text style={styles.timeText}>{record.time}</Text>
          </Text>
        </View>
        
        <View style={styles.durationBadge}>
          <FontAwesome6 name="clock" size={12} color="#6b7280" />
          <Text style={styles.durationText}>{record.duration}分钟</Text>
        </View>
      </View>

      <View style={styles.cardBottomRow}>
        <View style={styles.cardLeftInfo}>
          <View style={styles.infoTag}>
            <View style={[styles.dot, { backgroundColor: getAnxietyColor(record.anxietyLevel) }]} />
            <Text style={styles.infoLabel}>
              焦虑程度: {record.anxietyLevel}分
            </Text>
          </View>
          
          <View style={styles.infoTag}>
            <FontAwesome6 
              name={record.iconType === 'headphones' ? 'headphones' : 'heart'} 
              size={12} 
              color="#8b5cf6" 
            />
            <Text style={styles.infoLabel} numberOfLines={1}>
              {record.practiceType}
            </Text>
          </View>
        </View>

        <View style={styles.cardRightInfo}>
          <Text 
            style={styles.feelingText} 
            numberOfLines={isExpanded ? undefined : 2} 
            ellipsizeMode="tail"
          >
            {record.feeling}
          </Text>
          
          {isExpanded && (
             <View style={{ alignSelf: 'flex-end', marginTop: 4 }}>
               <FontAwesome6 name="chevron-up" size={10} color="#9ca3af" />
             </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecordItem;