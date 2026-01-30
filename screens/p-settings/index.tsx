

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

const SettingsScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleReminderSettingsPress = () => {
    router.push('/p-reminder_settings');
  };

  const handleDisabledFeaturePress = () => {
    Alert.alert('提示', '该功能正在开发中，敬请期待...');
  };

  const renderSettingItem = (
    icon: string,
    iconColor: string,
    iconBgColor: string,
    title: string,
    subtitle: string,
    onPress: () => void,
    isEnabled: boolean = true
  ) => (
    <TouchableOpacity
      style={[styles.settingItem, !isEnabled && styles.disabledSettingItem]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!isEnabled}
    >
      <View style={styles.settingItemContent}>
        <View style={[styles.settingItemIcon, { backgroundColor: iconBgColor }]}>
          <FontAwesome6 name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.settingItemTextContainer}>
          <Text style={[styles.settingItemTitle, !isEnabled && styles.disabledText]}>
            {title}
          </Text>
          <Text style={[styles.settingItemSubtitle, !isEnabled && styles.disabledText]}>
            {subtitle}
          </Text>
        </View>
      </View>
      <View style={styles.settingItemArrow}>
        <FontAwesome6 name="chevron-right" size={16} color="#6b7280" />
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
    </View>
  );

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
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <FontAwesome6 name="arrow-left" size={18} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>设置</Text>
        </View>
      </LinearGradient>

      {/* 设置内容区域 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 应用设置卡片 */}
        <View style={styles.settingsCard}>
          {renderSettingItem(
            'bell',
            '#f59e0b',
            'rgba(245, 158, 11, 0.1)',
            '提醒设置',
            '配置每日练习提醒',
            handleReminderSettingsPress,
            true
          )}
          <View style={styles.settingItemDivider} />
          {renderSettingItem(
            'volume-high',
            '#6366f1',
            'rgba(99, 102, 241, 0.1)',
            '音频设置',
            '音量、播放速度等',
            handleDisabledFeaturePress,
            false
          )}
          <View style={styles.settingItemDivider} />
          {renderSettingItem(
            'shield-halved',
            '#8b5cf6',
            'rgba(139, 92, 246, 0.1)',
            '隐私设置',
            '数据隐私与安全',
            handleDisabledFeaturePress,
            false
          )}
          <View style={styles.settingItemDivider} />
          {renderSettingItem(
            'circle-info',
            '#06b6d4',
            'rgba(6, 182, 212, 0.1)',
            '关于我们',
            '版本信息、用户协议',
            handleDisabledFeaturePress,
            false
          )}
        </View>

        {/* 账户设置卡片 */}
        <View style={styles.settingsCard}>
          {renderSectionHeader('账户')}
          {renderSettingItem(
            'lock',
            '#10b981',
            'rgba(16, 185, 129, 0.1)',
            '账户安全',
            '密码、登录设置',
            handleDisabledFeaturePress,
            false
          )}
          <View style={styles.settingItemDivider} />
          {renderSettingItem(
            'database',
            '#3b82f6',
            'rgba(59, 130, 246, 0.1)',
            '数据管理',
            '备份、导出数据',
            handleDisabledFeaturePress,
            false
          )}
        </View>

        {/* 帮助与支持卡片 */}
        <View style={styles.settingsCard}>
          {renderSectionHeader('帮助与支持')}
          {renderSettingItem(
            'circle-question',
            '#f59e0b',
            'rgba(245, 158, 11, 0.1)',
            '常见问题',
            '使用帮助、常见问题',
            handleDisabledFeaturePress,
            false
          )}
          <View style={styles.settingItemDivider} />
          {renderSettingItem(
            'comment-dots',
            '#06b6d4',
            'rgba(6, 182, 212, 0.1)',
            '意见反馈',
            '告诉我们您的建议',
            handleDisabledFeaturePress,
            false
          )}
          <View style={styles.settingItemDivider} />
          {renderSettingItem(
            'headset',
            '#6366f1',
            'rgba(99, 102, 241, 0.1)',
            '联系客服',
            '在线客服支持',
            handleDisabledFeaturePress,
            false
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

