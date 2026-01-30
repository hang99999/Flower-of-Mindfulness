import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  Modal, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../utils/supabaseClient';
import styles from './styles';

const ProfileScreen = () => {
  const router = useRouter();
  
  // 状态管理
  const [modalVisible, setModalVisible] = useState(false);
  const [inputCode, setInputCode] = useState(''); // 研究代码
  const [inputSubjectId, setInputSubjectId] = useState(''); // [新增] 手机号后六位
  const [currentGroup, setCurrentGroup] = useState('PUBLIC');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const code = await AsyncStorage.getItem('user_study_code') || 'PUBLIC';
    setCurrentGroup(code);
  };

  // 处理提交
  const handleSubmit = async () => {
    setIsVerifying(true);
    try {
      // 1. 保存手机号后六位 (Subject ID)
      const cleanSubjectId = inputSubjectId.trim();
      await AsyncStorage.setItem('research_subject_id', cleanSubjectId);

      // 2. 处理研究代码 (Study Code)
      const cleanCode = inputCode.trim().toUpperCase(); // 自动转大写

      if (!cleanCode) {
        // 如果代码为空，重置为大众版
        await AsyncStorage.setItem('user_study_code', 'PUBLIC');
        setCurrentGroup('PUBLIC');
        setModalVisible(false);
        Alert.alert('设置更新', '已保存手机尾号，并切换至大众版本。');
        return;
      }

      // 验证代码有效性
      const { data, error } = await supabase
        .from('study_codes')
        .select('code, description')
        .eq('code', cleanCode)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        Alert.alert('无效代码', '该研究代码不存在或已失效');
        setIsVerifying(false);
        return;
      }

      // 验证通过，保存
      await AsyncStorage.setItem('user_study_code', data.code);
      setCurrentGroup(data.code);
      setModalVisible(false);
      
      Alert.alert(
        '设置成功', 
        `手机尾号: ${cleanSubjectId || '未填'}\n当前版本: ${data.description}`
      );

    } catch (err) {
      Alert.alert('错误', '网络请求失败，请稍后重试');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUserInfoPress = async () => {
    // 打开弹窗时回显已有数据
    const savedSubjectId = await AsyncStorage.getItem('research_subject_id') || '';
    setInputSubjectId(savedSubjectId);
    setInputCode(currentGroup === 'PUBLIC' ? '' : currentGroup);
    setModalVisible(true);
  };

  const handleNotificationPress = () => Alert.alert('通知', '通知功能开发中...');
  const handleSettingsPress = () => router.push('/p-settings');
  const handleStatsPress = () => router.push('/p-record_history');
  const handleHelpPress = () => Alert.alert('帮助', '功能开发中...');
  const handleAboutPress = () => Alert.alert('关于', '功能开发中...');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.titleSection}>
              <Text style={styles.appTitle}>我的</Text>
              <Text style={styles.appSubtitle}>个人中心</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
              <FontAwesome6 name="bell" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.userInfoSection}>
          <TouchableOpacity 
            style={styles.userInfoCard}
            onPress={handleUserInfoPress}
            activeOpacity={0.95}
          >
            <View style={styles.userInfoContent}>
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.userAvatar}
              >
                <FontAwesome6 name="user" size={24} color="#ffffff" />
              </LinearGradient>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>心灵探索者</Text>
                <Text style={styles.userSubtitle}>
                  当前版本: {currentGroup === 'PUBLIC' ? '大众通用版' : currentGroup}
                </Text>
                <Text style={{fontSize: 12, color: '#6366f1', marginTop: 4}}>
                  点击完善科研信息
                </Text>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color="#6b7280" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <View style={styles.menuCard}>
            <TouchableOpacity style={[styles.menuItem, styles.menuItemWithBorder]} onPress={handleSettingsPress}>
              <View style={styles.menuItemContent}>
                <View style={[styles.menuIcon, styles.settingsIcon]}><FontAwesome6 name="gear" size={20} color="#3b82f6" /></View>
                <View style={styles.menuTextContainer}><Text style={styles.menuTitle}>设置</Text><Text style={styles.menuSubtitle}>应用设置与偏好</Text></View>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, styles.menuItemWithBorder]} onPress={handleStatsPress}>
              <View style={styles.menuItemContent}>
                <View style={[styles.menuIcon, styles.statsIcon]}><FontAwesome6 name="chart-column" size={20} color="#06b6d4" /></View>
                <View style={styles.menuTextContainer}><Text style={styles.menuTitle}>练习统计</Text><Text style={styles.menuSubtitle}>查看详细练习数据</Text></View>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, styles.menuItemWithBorder]} onPress={handleHelpPress}>
              <View style={styles.menuItemContent}>
                <View style={[styles.menuIcon, styles.helpIcon]}><FontAwesome6 name="circle-question" size={20} color="#f59e0b" /></View>
                <View style={styles.menuTextContainer}><Text style={styles.menuTitle}>帮助与反馈</Text><Text style={styles.menuSubtitle}>使用帮助和问题反馈</Text></View>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleAboutPress}>
              <View style={styles.menuItemContent}>
                <View style={[styles.menuIcon, styles.aboutIcon]}><FontAwesome6 name="circle-info" size={20} color="#6b7280" /></View>
                <View style={styles.menuTextContainer}><Text style={styles.menuTitle}>关于</Text><Text style={styles.menuSubtitle}>版本信息和使用条款</Text></View>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 信息完善弹窗 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <View style={{ width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
              完善科研信息
            </Text>
            
            {/* 1. 研究代码 */}
            <Text style={{ marginLeft: 4, marginBottom: 6, color: '#333', fontWeight: '600' }}>
              1. 研究代码 (Study Code)
            </Text>
            <TextInput
              style={{ 
                width: '100%', height: 48, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, 
                paddingHorizontal: 12, marginBottom: 16, backgroundColor: '#f9f9f9', fontSize: 16 
              }}
              placeholder="例如: CHANGE2025"
              value={inputCode}
              onChangeText={setInputCode}
              autoCapitalize="characters"
            />

            {/* 2. 手机号后六位 */}
            <Text style={{ marginLeft: 4, marginBottom: 6, color: '#333', fontWeight: '600' }}>
              2. 手机号后 6 位 (Subject ID)
            </Text>
            <Text style={{ marginLeft: 4, marginBottom: 8, fontSize: 12, color: '#999' }}>
              * 用于匹配您的实验数据，请务必准确填写
            </Text>
            <TextInput
              style={{ 
                width: '100%', height: 48, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, 
                paddingHorizontal: 12, marginBottom: 24, backgroundColor: '#f9f9f9', fontSize: 18,
                letterSpacing: 2, fontWeight: '600'
              }}
              placeholder="例如: 123456"
              value={inputSubjectId}
              onChangeText={(text) => {
                const numeric = text.replace(/[^0-9]/g, '').slice(0, 6); // 限制只能输入6位数字
                setInputSubjectId(numeric);
              }}
              keyboardType="number-pad"
              maxLength={6}
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={{ flex: 1, height: 44, borderRadius: 22, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' }}
              >
                <Text style={{ color: '#666', fontWeight: '600' }}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleSubmit}
                disabled={isVerifying}
                style={{ flex: 1, height: 44, borderRadius: 22, backgroundColor: '#6366f1', justifyContent: 'center', alignItems: 'center' }}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>
                  {isVerifying ? '验证中...' : '保存'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;