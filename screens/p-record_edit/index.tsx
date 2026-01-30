import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import styles from './styles';
import { supabase } from '../../utils/supabaseClient';
import { getUserId, getSubjectId } from '../../utils/userContext';

// 数据结构定义
interface RecordData {
  id: string;
  createdAt: string;       
  displayTime: string;     
  duration: number | null; 
  anxietyRating: number;   // 0-100 VAS 数值
  description: string;     
  tags: string[];          
}

const RecordEditScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // 状态管理
  const [anxietyScore, setAnxietyScore] = useState<number>(50); // 默认 50 (中立状态)
  const [feelingDescription, setFeelingDescription] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  
  const [practiceDuration, setPracticeDuration] = useState<number | null>(null); // 分钟
  const [rawSeconds, setRawSeconds] = useState<number>(0); // 秒

  // 快速标签数据
  const quickTags = [
    { id: 'relaxed', label: '放松', color: '#6366f1' },
    { id: 'peaceful', label: '平静', color: '#8b5cf6' },
    { id: 'stressed', label: '紧张', color: '#f59e0b' },
    { id: 'anxious', label: '焦虑', color: '#06b6d4' },
    { id: 'focused', label: '专注', color: '#10b981' },
    { id: 'energized', label: '活力', color: '#3b82f6' },
  ];

  // 初始化页面数据
  useEffect(() => {
    const now = new Date();
    const datetimeString = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    setCurrentDateTime(datetimeString);

    if (params.practice_duration_seconds) {
      const secondsStr = Array.isArray(params.practice_duration_seconds) 
        ? params.practice_duration_seconds[0] 
        : params.practice_duration_seconds;
      
      const seconds = parseInt(secondsStr);
      
      if (!isNaN(seconds)) {
        setRawSeconds(seconds); 
        setPracticeDuration(Math.floor(seconds / 60)); 
      }
    }
  }, [params]);

  // 根据分数动态改变颜色 (0-100)
  // 0(绿) -> 50(黄) -> 100(红)
  const getVASColor = (score: number) => {
    if (score <= 25) return '#10b981'; // 绿色 (平静)
    if (score <= 50) return '#3b82f6'; // 蓝色 (还好)
    if (score <= 75) return '#f59e0b'; // 橙色 (有点焦虑)
    return '#ef4444'; // 红色 (非常焦虑)
  };

  const currentColor = getVASColor(anxietyScore);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleFeelingDescriptionChange = (text: string) => {
    if (text.length <= 500) {
      setFeelingDescription(text);
    }
  };

  const handleQuickTagPress = (tag: string) => {
    const isSelected = selectedTags.includes(tag);
    if (isSelected) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
      const cleanText = feelingDescription.replace(new RegExp(`#${tag}\\s?`, 'g'), '').trim();
      setFeelingDescription(cleanText);
    } else {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      const tagsText = `#${tag}`; 
      const currentText = feelingDescription.trim();
      const newText = currentText + (currentText ? ' ' : '') + tagsText;
      if (newText.length <= 500) {
        setFeelingDescription(newText);
      }
    }
  };

  const isSaveButtonEnabled = () => true;

  const handleCancelPress = () => {
    Alert.alert(
      '确定要取消吗？',
      '未保存的内容将丢失。',
      [
        { text: '继续编辑', style: 'cancel' },
        { 
          text: '确定取消', 
          style: 'destructive',
          onPress: () => {
            if (router.canGoBack()) router.back();
          }
        }
      ]
    );
  };

  const handleSavePress = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const userId = await getUserId();
      const subjectId = await getSubjectId();
      const studyCode = await AsyncStorage.getItem('user_study_code') || 'PUBLIC';
      const audioId = params.audio_id ? parseInt(Array.isArray(params.audio_id) ? params.audio_id[0] : params.audio_id) : null; 

      // 上传到 Supabase
      supabase.from('practice_logs').insert({
        user_uuid: userId,
        subject_id: subjectId,
        study_code: studyCode,
        audio_id: audioId,
        duration: rawSeconds, 
        anxiety_rating: anxietyScore, // 存 0-100
        description: feelingDescription,
        tags: selectedTags.join(','),
        created_at: new Date().toISOString(),
      }).then(({ error }) => {
        if (error) console.error('Supabase 上传失败:', error);
        else console.log(`Supabase 上传成功: ${rawSeconds}s, VAS:${anxietyScore}`);
      });

      // 保存到本地
      const newRecord: RecordData = {
        id: Date.now().toString(), 
        createdAt: new Date().toISOString(),
        displayTime: currentDateTime,
        duration: practiceDuration, 
        anxietyRating: anxietyScore, 
        description: feelingDescription,
        tags: selectedTags,
      };

      const STORAGE_KEY = 'user_practice_records';
      const existingDataJson = await AsyncStorage.getItem(STORAGE_KEY);
      let records: RecordData[] = [];
      if (existingDataJson) records = JSON.parse(existingDataJson);
      records.unshift(newRecord);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records));

      await new Promise(resolve => setTimeout(resolve, 500));
      setIsSuccessModalVisible(true);

    } catch (error) {
      console.error('保存失败:', error);
      Alert.alert('保存失败', '存储数据时发生错误，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuccessModalOk = () => {
    setIsSuccessModalVisible(false);
    if (router.canGoBack()) router.back();
  };

  // [修改] VAS 滑动条渲染逻辑
  const renderVASSlider = () => {
    return (
      <View style={styles.sliderContainer}>
        {/* 引导文案 */}
        <Text style={styles.sliderPrompt}>
          请滑动滑块，标记你现在的焦虑/放松程度
        </Text>

        {/* 数值大字显示 */}
        <View style={styles.sliderScoreContainer}>
          <Text style={[styles.sliderScoreText, { color: currentColor }]}>
            {anxietyScore}
          </Text>
          <Text style={styles.sliderScaleText}>/ 100</Text>
        </View>
        
        {/* 滑块本体 */}
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={100}
          step={1} 
          value={anxietyScore}
          onValueChange={setAnxietyScore}
          minimumTrackTintColor={currentColor}
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor={currentColor}
        />
        
        {/* 左右刻度 - VAS 核心 */}
        <View style={styles.sliderRangeLabels}>
          <Text style={[styles.rangeText, { color: '#10b981' }]}>完全放松/平静</Text>
          <Text style={[styles.rangeText, { color: '#ef4444' }]}>极度焦虑/紧张</Text>
        </View>
      </View>
    );
  };

  const renderQuickTags = () => {
    return (
      <View style={styles.tagsContainer}>
        {quickTags.map((tag) => {
          const isSelected = selectedTags.includes(tag.label);
          return (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.tagButton,
                {
                  backgroundColor: isSelected ? tag.color : `${tag.color}1A`,
                  borderColor: isSelected ? tag.color : `${tag.color}33`,
                }
              ]}
              onPress={() => handleQuickTagPress(tag.label)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tagButtonText, { color: isSelected ? '#ffffff' : tag.color }]}>{tag.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部标题栏 */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress} activeOpacity={0.7}>
              <FontAwesome6 name="arrow-left" size={18} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>记录</Text>
              <Text style={styles.headerSubtitle}>记录当前状态</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* 主内容区域 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View style={styles.formCard}>
            
            {/* 日期时间 */}
            <View style={styles.datetimeSection}>
              <View style={styles.datetimeContent}>
                <View style={styles.datetimeInfo}>
                  <Text style={styles.datetimeLabel}>记录时间</Text>
                  <Text style={styles.currentDatetime}>{currentDateTime}</Text>
                </View>
                <View style={styles.datetimeIcon}><FontAwesome5 name="calendar-alt" size={20} color="#6366f1" /></View>
              </View>
            </View>

            {/* 练习时长 */}
            {practiceDuration !== null && (
              <View style={styles.practiceDurationSection}>
                <View style={styles.durationContent}>
                  <View style={styles.durationInfo}>
                    <Text style={styles.durationLabel}>本次练习</Text>
                    <Text style={styles.practiceDurationText}>{practiceDuration}分钟</Text>
                  </View>
                  <View style={styles.durationIcon}><FontAwesome6 name="clock" size={20} color="#10b981" /></View>
                </View>
              </View>
            )}

            {/* VAS 滑动条 */}
            <View style={styles.anxietyRatingSection}>
              <Text style={styles.sectionTitle}>焦虑程度 (VAS)</Text>
              {renderVASSlider()}
            </View>

            {/* 感受描述 */}
            <View style={styles.feelingDescriptionSection}>
              <Text style={styles.sectionTitle}>练习感受</Text>
              <View style={styles.feelingContent}>
                <TextInput
                  style={styles.feelingTextarea}
                  placeholder="描述一下你现在的感受..."
                  placeholderTextColor="#6b7280"
                  value={feelingDescription} onChangeText={handleFeelingDescriptionChange}
                  multiline maxLength={500} textAlignVertical="top"
                />
                <Text style={styles.charCount}>{feelingDescription.length}/500</Text>
              </View>
            </View>

            {/* 快速标签 */}
            <View style={styles.quickTagsSection}>
              <Text style={styles.sectionTitle}>快速标签</Text>
              {renderQuickTags()}
            </View>

          </View>
        </View>
      </ScrollView>

      {/* 底部按钮 */}
      <View style={styles.bottomActions}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPress} activeOpacity={0.7}>
            <Text style={styles.cancelButtonText}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, !isSaveButtonEnabled() && styles.saveButtonDisabled]}
            onPress={handleSavePress} disabled={!isSaveButtonEnabled() || isSaving} activeOpacity={0.7}
          >
            <Text style={styles.saveButtonText}>{isSaving ? '保存中...' : '保存记录'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 成功弹窗 */}
      <Modal visible={isSuccessModalVisible} transparent animationType="fade" onRequestClose={() => setIsSuccessModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIcon}><FontAwesome6 name="check" size={24} color="#10b981" /></View>
            <Text style={styles.successTitle}>保存成功</Text>
            <Text style={styles.successMessage}>记录已同步至云端</Text>
            <TouchableOpacity style={styles.successOkButton} onPress={handleSuccessModalOk} activeOpacity={0.7}>
              <Text style={styles.successOkButtonText}>确定</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default RecordEditScreen;