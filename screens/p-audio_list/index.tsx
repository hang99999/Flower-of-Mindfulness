import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../utils/supabaseClient';
import styles from './styles';

interface AudioItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  rawDuration: number;
  category: string; // 英文 Key (用于过滤)
  categoryTitle: string; // 中文 Title (用于显示)
  difficulty: string; 
  imageUrl: string;
  audioUrl: string;
}

interface Category {
  id: string;
  title: string;
  key: string;
}

const AudioListScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', title: '全部', key: 'all' }
  ]);
  const [displayedAudios, setDisplayedAudios] = useState<AudioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 格式化时间
  const formatDurationStr = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    return `${mins}分钟`;
  };

  // [核心] 获取所有数据
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const userCode = await AsyncStorage.getItem('user_study_code') || 'PUBLIC';
      console.log('正在加载列表数据, 组别:', userCode);

      const [categoriesResponse, audiosResponse] = await Promise.all([
        // 1. 获取分类表
        supabase.from('categories').select('*').order('sort_order'),
        
        // 2. 获取音频表 (联表查询)
        supabase
          .from('study_audio_map')
          .select(`
            audio_id,
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
      ]);

      // --- 处理分类 ---
      if (categoriesResponse.error) throw categoriesResponse.error;
      const dbCategories = categoriesResponse.data || [];
      
      const newCategoriesList: Category[] = [
        { id: 'all', title: '全部', key: 'all' },
        ...dbCategories.map((c: any) => ({
          id: c.key,
          title: c.title,
          key: c.key
        }))
      ];
      setCategories(newCategoriesList);

      // 建立分类映射字典 { key: title }
      const categoryMap: Record<string, string> = {};
      dbCategories.forEach((c: any) => {
        categoryMap[c.key] = c.title;
      });

      // --- 处理音频 ---
      if (audiosResponse.error) throw audiosResponse.error;
      const dbAudios = audiosResponse.data || [];

      const formattedList: AudioItem[] = dbAudios
        .filter((item: any) => item.audios)
        .map((item: any) => {
          const audio = item.audios;
          const catKey = audio.category || 'other'; 
          
          return {
            id: audio.id.toString(),
            title: audio.title,
            description: audio.description || '暂无简介',
            duration: formatDurationStr(audio.duration || 0),
            rawDuration: audio.duration || 0,
            
            category: catKey, // 用于代码逻辑过滤
            categoryTitle: categoryMap[catKey] || '通用', // 用于 UI 显示中文
            
            // 读取数据库里的 difficulty，如果没有则默认'入门'
            difficulty: audio.difficulty || '入门',
            
            imageUrl: audio.cover_url || 'https://via.placeholder.com/300',
            audioUrl: audio.url
          };
        });

      setDisplayedAudios(formattedList);

    } catch (err) {
      console.error('数据加载失败:', err);
      Alert.alert('提示', '数据加载失败，请检查网络');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllData();
    }, [])
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchAllData();
  }, []);

  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) router.back();
  }, [router]);

  const handleCategoryPress = useCallback((categoryKey: string) => {
    setSelectedCategory(categoryKey);
  }, []);

  const navigateToPlay = useCallback((item: AudioItem) => {
    router.push({
      pathname: '/p-audio_play',
      params: { 
        audio_data: JSON.stringify({
          id: item.id,
          title: item.title,
          description: item.description,
          duration: item.rawDuration,
          category: item.categoryTitle, // 传给播放页显示中文
          cover: item.imageUrl,
          audioUrl: item.audioUrl,
          difficulty: item.difficulty // [新增] 把难度也传给播放页
        })
      }
    });
  }, [router]);

  // 过滤逻辑
  const filteredAudioData = selectedCategory === 'all' 
    ? displayedAudios 
    : displayedAudios.filter(item => item.category === selectedCategory);

  const renderCategoryTab = useCallback((category: Category) => {
    const isActive = selectedCategory === category.key;
    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryTab,
          isActive ? styles.categoryTabActive : styles.categoryTabInactive,
        ]}
        onPress={() => handleCategoryPress(category.key)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.categoryTabText,
            isActive ? styles.categoryTabTextActive : styles.categoryTabTextInactive,
          ]}
        >
          {category.title}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedCategory, handleCategoryPress]);

  const renderAudioItem = useCallback((item: AudioItem) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.audioItem}
        onPress={() => navigateToPlay(item)}
        activeOpacity={0.95}
      >
        <View style={styles.audioItemContent}>
          <Image source={{ uri: item.imageUrl }} style={styles.audioImage} />
          <View style={styles.audioInfo}>
            <Text style={styles.audioTitle}>{item.title}</Text>
            <Text style={styles.audioDescription} numberOfLines={2}>{item.description}</Text>
            <View style={styles.audioMeta}>
              <View style={styles.audioMetaItem}>
                <FontAwesome6 name="clock" size={10} color="#6b7280" />
                <Text style={styles.audioMetaText}>{item.duration}</Text>
              </View>
              <View style={styles.audioMetaItem}>
                <FontAwesome6 name="tag" size={10} color="#6b7280" />
                <Text style={styles.audioMetaText}>{item.categoryTitle}</Text> 
              </View>
              {/* [修改] 动态显示难度 */}
              <View style={styles.audioMetaItem}>
                <FontAwesome6 name="star" size={10} color="#6b7280" />
                <Text style={styles.audioMetaText}>{item.difficulty}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => navigateToPlay(item)}
            activeOpacity={0.8}
          >
            <FontAwesome6 name="play" size={16} color="#ffffff" style={styles.playIcon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }, [navigateToPlay]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
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
            <View style={styles.titleSection}>
              <Text style={styles.pageTitle}>音频练习</Text>
              <Text style={styles.pageSubtitle}>选择适合你的冥想音频</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.categorySection}>
          <View style={styles.categoryTabs}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsContainer}
            >
              {categories.map(renderCategoryTab)}
            </ScrollView>
          </View>
        </View>

        <View style={styles.audioListSection}>
          <View style={styles.audioListHeader}>
            <Text style={styles.listTitle}>冥想音频</Text>
            <Text style={styles.audioCount}>共 {filteredAudioData.length} 个音频</Text>
          </View>
          
          {isLoading ? (
             <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={{ marginTop: 10, color: '#6b7280' }}>同步内容中...</Text>
             </View>
          ) : (
             <View style={styles.audioList}>
               {filteredAudioData.map(renderAudioItem)}
               {filteredAudioData.length === 0 && (
                 <Text style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>暂无相关音频</Text>
               )}
             </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AudioListScreen;