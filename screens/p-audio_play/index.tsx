import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { Audio, AVPlaybackStatus } from 'expo-av'; 
import styles from './styles';

interface AudioData {
  id: string; 
  title: string;
  description: string;
  duration: number; 
  category: string;
  cover: string;
  audioUrl: string; 
}

const AudioPlayScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [sound, setSound] = useState<Audio.Sound | null>(null); 
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [duration, setDuration] = useState(0); 
  const [currentAudioData, setCurrentAudioData] = useState<AudioData | null>(null);
  
  // [修复 1] 改用 useRef 存储累积时长，解决闭包陷阱问题
  // 因为 Ref 是可变的引用，无论在哪个回调版本里，ref.current 都是最新的
  const accumulatedPlayTimeRef = useRef(0);
  
  // 上次开始播放的时间点
  const lastPlayStartTimeRef = useRef<number | null>(null);
  
  // [修复 2] 防止结束逻辑被触发多次
  const isEndingRef = useRef(false);

  const formatAudioTime = (seconds: number): string => {
    if (!seconds || seconds < 0) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (params.audio_data) {
      try {
        const audioObj = JSON.parse(params.audio_data as string);
        setCurrentAudioData(audioObj);
        setDuration(audioObj.duration); 
        
        Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        }).catch(error => console.log('Audio mode setup failed', error));

      } catch (e) {
        console.error("解析音频数据出错:", e);
        Alert.alert("错误", "音频数据加载失败");
      }
    }
  }, [params.audio_data]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync().catch(err => console.log('Unload error', err));
      }
    };
  }, [sound]);

  // [修复 3] 更新累积时间的逻辑改为操作 Ref
  const updateAccumulatedTime = () => {
    if (lastPlayStartTimeRef.current !== null) {
      const now = Date.now();
      const sessionDurationSeconds = (now - lastPlayStartTimeRef.current) / 1000;
      
      // 更新 Ref，而不是 State
      accumulatedPlayTimeRef.current += sessionDurationSeconds;
      
      lastPlayStartTimeRef.current = null; 
      return sessionDurationSeconds;
    }
    return 0;
  };

  const startTimerSession = () => {
    lastPlayStartTimeRef.current = Date.now();
  };

  async function playSound() {
    if (!currentAudioData?.audioUrl) {
      Alert.alert('提示', '无效的音频链接');
      return;
    }

    try {
      if (sound) {
        await sound.playAsync();
        setIsAudioPlaying(true);
        startTimerSession(); 
        return;
      }

      // [注意] createAsync 传入的 onPlaybackStatusUpdate 是在这一刻创建的
      // 如果使用 State，它只能读到这一刻的 State。但使用 Ref，它永远能读到最新的 Ref.current。
      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri: currentAudioData.audioUrl },
        { shouldPlay: true }, 
        onPlaybackStatusUpdate 
      );
      
      setSound(newSound);
      setIsAudioPlaying(true);
      startTimerSession(); 

      if (status.isLoaded && status.durationMillis) {
        setDuration(status.durationMillis / 1000);
      }

    } catch (error) {
      console.error('播放失败:', error);
      Alert.alert('播放失败', '无法加载音频资源');
    }
  }

  async function pauseSound() {
    if (sound) {
      await sound.pauseAsync();
      setIsAudioPlaying(false);
      updateAccumulatedTime(); 
    }
  }

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setCurrentAudioTime(status.positionMillis / 1000);
      
      // 只有当自然播放结束时才触发
      if (status.didJustFinish && !status.isLooping) {
        // [修复 4] 使用 handleAudioEnded 处理，它内部现在读取的是 Ref，安全了
        handleAudioEnded(); 
      }
    }
  };

  const handleTogglePlayPause = () => {
    if (isAudioPlaying) {
      pauseSound();
    } else {
      playSound();
    }
  };

  // [核心修复逻辑]
  const handleAudioEnded = async () => {
    // 防止重复触发
    if (isEndingRef.current) return;
    isEndingRef.current = true;

    setIsAudioPlaying(false);
    
    // 1. 计算最后一段的时间
    let finalSessionTime = 0;
    if (lastPlayStartTimeRef.current !== null) {
        finalSessionTime = (Date.now() - lastPlayStartTimeRef.current) / 1000;
        lastPlayStartTimeRef.current = null;
    }

    // 2. 计算总时间：从 Ref 中读取历史累积 + 最后一段
    const totalPracticeTime = accumulatedPlayTimeRef.current + finalSessionTime;
    const finalDurationInt = Math.floor(totalPracticeTime);

    console.log(`播放结束。累积: ${accumulatedPlayTimeRef.current}, 最后一段: ${finalSessionTime}, 总计: ${finalDurationInt}`);

    if (currentAudioData) {
        try {
            // 先停止并卸载，防止后台继续跑
            if (sound) {
                await sound.stopAsync();
            }
        } catch (e) {}

        // 跳转
        router.push({
            pathname: '/p-record_edit',
            params: {
                audio_id: currentAudioData.id,
                // 确保这里传的是数字
                practice_duration_seconds: finalDurationInt
            }
        });
        
        // 重置锁，虽然跳转走了可能不需要，但为了逻辑严谨
        setTimeout(() => { isEndingRef.current = false; }, 1000);
    }
  };

  const handleProgressChange = async (value: number) => {
    if (isAudioPlaying) {
        updateAccumulatedTime();
        startTimerSession();
    }
    if (sound) {
      const seekPosition = value * 1000; 
      try {
        await sound.setPositionAsync(seekPosition);
        setCurrentAudioTime(value);
      } catch (error) {
        // ignore
      }
    }
  };

  const handleBackPress = async () => {
    try {
      if (sound) {
        // 只有在播放时退出才更新时间，虽然这里不保存，但为了逻辑一致
        if (isAudioPlaying) updateAccumulatedTime();
        await sound.stopAsync();
        await sound.unloadAsync();
      }
    } catch (error) {}
    router.back();
  };

  const handleMoreOptionsPress = () => {
    Alert.alert('更多选项', '功能开发中...');
  };

  if (!currentAudioData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>加载数据中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const progressPercentage = duration > 0 
    ? (currentAudioTime / duration) * 100 
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 顶部导航栏 */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <FontAwesome6 name="arrow-left" size={18} color="#ffffff" />
            </TouchableOpacity>
            
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {currentAudioData.title}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleMoreOptionsPress}
              activeOpacity={0.7}
            >
              <FontAwesome6 name="ellipsis" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* 音频信息区域 */}
        <View style={styles.audioInfoSection}>
          <View style={styles.audioInfoCard}>
            <View style={styles.audioCoverSection}>
              <View style={styles.audioVisualizer}>
                <Image 
                  source={{ uri: currentAudioData.cover }}
                  style={styles.audioCover}
                  resizeMode="cover"
                />
                <View style={[
                  styles.playIndicator,
                  { opacity: isAudioPlaying ? 1 : 0 }
                ]}>
                  <View style={styles.playIndicatorInner}>
                    <FontAwesome6 
                      name="play" 
                      size={24} 
                      color="#6366f1" 
                      style={styles.playIndicatorIcon}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.audioDetails}>
              <Text style={styles.audioFullTitle}>{currentAudioData.title}</Text>
              <Text style={styles.audioDescription}>{currentAudioData.description}</Text>
              <View style={styles.audioMeta}>
                <View style={styles.audioMetaItem}>
                  <FontAwesome6 name="tag" size={12} color="#6b7280" />
                  <Text style={styles.audioMetaText}>{currentAudioData.category}</Text>
                </View>
                <View style={styles.audioMetaItem}>
                  <FontAwesome6 name="clock" size={12} color="#6b7280" />
                  <Text style={styles.audioMetaText}>{formatAudioTime(duration)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 播放控制区域 */}
        <View style={styles.playbackControlsSection}>
          <View style={styles.controlsCard}>
            <View style={styles.progressSection}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressTime}>{formatAudioTime(currentAudioTime)}</Text>
                <Text style={styles.progressTime}>{formatAudioTime(duration)}</Text>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <LinearGradient
                    colors={['#6366f1', '#8b5cf6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressBar, { width: `${progressPercentage}%` }]}
                  />
                </View>
                <Slider
                  style={styles.progressSlider}
                  minimumValue={0}
                  maximumValue={duration || 1}
                  value={currentAudioTime}
                  onValueChange={handleProgressChange}
                  minimumTrackTintColor="transparent"
                  maximumTrackTintColor="transparent"
                  thumbTintColor="#6366f1"
                />
              </View>
            </View>

            <View style={styles.controlButtons}>
              <TouchableOpacity 
                style={styles.playPauseButton}
                onPress={handleTogglePlayPause}
                activeOpacity={0.8}
              >
                <FontAwesome6 
                  name={isAudioPlaying ? "pause" : "play"} 
                  size={24} 
                  color="#ffffff" 
                  style={isAudioPlaying ? undefined : styles.playIconAdjustment}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AudioPlayScreen;