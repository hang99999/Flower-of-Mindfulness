import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator, // 新增 loading 组件
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../utils/supabaseClient'; 
import styles from './styles';

// 定义音频数据结构
interface AudioData {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string; // 这里将存储中文名称
  cover: string;
  audioUrl: string;
  difficulty: string; // 新增难度字段
}

const HomeScreen = () => {
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<AudioData | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 加载状态

  // 页面加载时获取数据
  useEffect(() => {
    fetchDailyRecommendation();
  }, []);

  const fetchDailyRecommendation = async () => {
    try {
      setIsLoading(true);
      // 1. 获取用户组别
      const userCode = await AsyncStorage.getItem('user_study_code') || 'PUBLIC';
      
      // 2. 并行发起两个请求：获取推荐音频 + 获取分类映射表
      const [audioResponse, categoryResponse] = await Promise.all([
        // 请求 A: 获取该组别下的第一条音频
        supabase
          .from('study_audio_map')
          .select(`
            audios (
              id,
              title,
              description,
              url,
              duration,
              category,
              cover_url,
              difficulty
            )
          `)
          .eq('study_code', userCode)
          .limit(1)
          .single(),
        
        // 请求 B: 获取所有分类，用于翻译 key -> 中文名
        supabase.from('categories').select('key, title')
      ]);

      if (audioResponse.error) throw audioResponse.error;

      // 3. 处理数据
      if (audioResponse.data && audioResponse.data.audios) {
        const audio = audioResponse.data.audios;
        
        // --- 核心逻辑：建立映射字典 ---
        // { "flower": "花之正念", "change": "观照变化" }
        const categoryMap: Record<string, string> = {};
        if (categoryResponse.data) {
          categoryResponse.data.forEach((cat: any) => {
            categoryMap[cat.key] = cat.title;
          });
        }

        // 这里的 audio.category 是数据库里的 key (如 'flower')
        // 我们尝试从 map 里取中文，取不到就用原值
        const displayCategory = categoryMap[audio.category] || audio.category || '推荐';

        setRecommendation({
          id: audio.id.toString(),
          title: audio.title,
          description: audio.description || '每日精选正念练习',
          duration: audio.duration || 0,
          category: displayCategory, // 现在这里是中文了！
          cover: audio.cover_url || 'https://via.placeholder.com/300',
          audioUrl: audio.url,
          difficulty: audio.difficulty || '入门' // 数据库没填就是入门
        });
      }
    } catch (err) {
      console.log('加载推荐失败', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMeditationPress = () => router.push('/p-audio_list');
  const handleRecordPress = () => router.push('/p-record_edit');
  const handleHistoryPress = () => router.push('/p-record_history');
  const handleReminderPress = () => router.push('/p-reminder_settings');

  // 点击推荐卡片跳转
  const handleRecommendationPress = () => {
    if (recommendation) {
      router.push({
        pathname: '/p-audio_play',
        params: { 
          audio_data: JSON.stringify(recommendation) 
        }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.titleSection}>
              <Text style={styles.appTitle}>若波</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.welcomeSection}>
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeContent}>
              <View style={styles.welcomeText}>
                <Text style={styles.welcomeTitle}>开始今天的正念之旅</Text>
                <Text style={styles.welcomeSubtitle}>让内心平静，找回自我</Text>
              </View>
              <View style={styles.welcomeIcon}>
                <FontAwesome6 name="leaf" size={24} color="#6366f1" />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.mainFeatures}>
          <Text style={styles.featuresTitle}>开始体验</Text>
          
          <View style={styles.mainActions}>
            <TouchableOpacity style={styles.meditationCard} onPress={handleMeditationPress} activeOpacity={0.95}>
              <View style={styles.meditationContent}>
                <View style={styles.meditationInfo}>
                  <View style={styles.meditationIconSection}>
                    <View style={styles.meditationIcon}><FontAwesome6 name="headphones" size={20} color="#6366f1" /></View>
                    <View><Text style={styles.meditationTitle}>开始冥想</Text><Text style={styles.meditationSubtitle}>选择引导音频开始练习</Text></View>
                  </View>
                </View>
                <View style={styles.meditationArrow}><FontAwesome6 name="chevron-right" size={14} color="#6b7280" /></View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.recordCard} onPress={handleRecordPress} activeOpacity={0.95}>
              <View style={styles.recordContent}>
                <View style={styles.recordInfo}>
                  <View style={styles.recordIconSection}>
                    <View style={styles.recordIcon}><FontAwesome6 name="heart" size={20} color="#8b5cf6" /></View>
                    <View><Text style={styles.recordTitle}>记录</Text><Text style={styles.recordSubtitle}>用文字记录内心变化</Text></View>
                  </View>
                </View>
                <View style={styles.recordArrow}><FontAwesome6 name="chevron-right" size={14} color="#6b7280" /></View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.historyCard} onPress={handleHistoryPress} activeOpacity={0.95}>
              <View style={styles.historyContent}>
                <View style={styles.historyIcon}><FontAwesome6 name="chart-line" size={20} color="#06b6d4" /></View>
                <Text style={styles.historyTitle}>练习历史</Text>
                <Text style={styles.historySubtitle}>查看过往记录</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reminderCard} onPress={handleReminderPress} activeOpacity={0.95}>
              <View style={styles.reminderContent}>
                <View style={styles.reminderIcon}><FontAwesome6 name="bell" size={20} color="#f59e0b" /></View>
                <Text style={styles.reminderTitle}>练习提醒</Text>
                <Text style={styles.reminderSubtitle}>设置每日提醒</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* 动态渲染今日推荐 */}
          {isLoading ? (
            <View style={[styles.dailyRecommendation, { justifyContent: 'center', alignItems: 'center', height: 100 }]}>
              <ActivityIndicator color="#667eea" />
              <Text style={{ color: '#999', marginTop: 8, fontSize: 12 }}>加载推荐内容...</Text>
            </View>
          ) : recommendation ? (
            <TouchableOpacity 
              style={styles.dailyRecommendation}
              onPress={handleRecommendationPress}
              activeOpacity={0.95}
            >
              <View style={styles.recommendationHeader}>
                <Text style={styles.recommendationTitle}>今日推荐</Text>
              </View>
              
              <View style={styles.recommendationContent}>
                <Image 
                  source={{ uri: recommendation.cover }}
                  style={styles.recommendationImage}
                />
                <View style={styles.recommendationInfo}>
                  <Text style={styles.recommendationAudioTitle} numberOfLines={1}>{recommendation.title}</Text>
                  <Text style={styles.recommendationAudioDescription} numberOfLines={1}>{recommendation.description}</Text>
                  <View style={styles.recommendationMeta}>
                    <View style={styles.audioDuration}>
                      <FontAwesome6 name="clock" size={10} color="#6b7280" />
                      <Text style={styles.metaText}>{Math.floor(recommendation.duration / 60)}分钟</Text>
                    </View>
                    <View style={styles.audioCategory}>
                      <FontAwesome6 name="tag" size={10} color="#6b7280" />
                      {/* 这里现在显示的是中文分类名 */}
                      <Text style={styles.metaText}>{recommendation.category}</Text>
                    </View>
                    {/* [新增] 显示难度 */}
                    <View style={[styles.audioCategory, {marginLeft: 8}]}>
                      <FontAwesome6 name="star" size={10} color="#6b7280" />
                      <Text style={styles.metaText}>{recommendation.difficulty}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.playRecommendation}
                  onPress={handleRecommendationPress}
                  activeOpacity={0.8}
                >
                  <FontAwesome6 name="play" size={16} color="#ffffff" style={styles.playIcon} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={[styles.dailyRecommendation, { justifyContent: 'center', alignItems: 'center', height: 100 }]}>
              <Text style={{ color: '#999' }}>暂无推荐内容</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;