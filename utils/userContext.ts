// utils/userContext.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID_KEY = 'device_anonymous_id';
const SUBJECT_ID_KEY = 'research_subject_id'; // 存储被试编号的 Key

// 生成随机设备ID（兜底用）
const generateUUID = () => {
  return 'user-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// 获取设备匿名ID
export const getUserId = async () => {
  try {
    let userId = await AsyncStorage.getItem(USER_ID_KEY);
    if (!userId) {
      userId = generateUUID();
      await AsyncStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
  } catch (error) {
    return 'unknown-user';
  }
};

// [新增] 获取被试编号 (手机号后六位)
export const getSubjectId = async () => {
  try {
    return await AsyncStorage.getItem(SUBJECT_ID_KEY);
  } catch (error) {
    return null;
  }
};

// [新增] 保存被试编号
export const setSubjectId = async (id: string) => {
  try {
    await AsyncStorage.setItem(SUBJECT_ID_KEY, id);
  } catch (error) {
    console.error('保存被试编号失败', error);
  }
};