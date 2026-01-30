import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    marginTop: 12,
    position: 'relative',
    zIndex: 10,
    paddingBottom: 32,
  },
  reminderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  reminderDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  reminderIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  toggleInfo: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  toggleSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  
  // 时间设置部分
  timeSection: {
    marginTop: 24,
  },
  timeInfo: {
    marginBottom: 16,
  },
  timeTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  timeSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  timePickerContainer: {
    gap: 16,
  },
  timePicker: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timePickerDisabled: {
    opacity: 0.5,
    backgroundColor: '#f1f5f9',
  },
  selectedTimeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    marginRight: 16,
  },
  selectedTimeText: {
    fontSize: 28, // 加大时间字体，使其成为焦点
    fontWeight: 'bold',
    color: '#1f2937',
    fontVariant: ['tabular-nums'], // 等宽数字，防止时间跳动
  },
  selectedTimeTextDisabled: {
    color: '#9ca3af',
  },
  
  // 快捷按钮样式
  quickTimes: {
    flexDirection: 'row',
    gap: 12,
  },
  quickTimeButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quickTimeButtonDisabled: {
    opacity: 0.5,
  },
  quickTimeButtonSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  quickTimeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  quickTimeTextDisabled: {
    color: '#9ca3af',
  },
  quickTimeTextSelected: {
    color: '#ffffff',
  },

  // 修改提示徽章
  editBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  editBadgeText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },

  // iOS Picker 控制栏
  iosPickerControl: {
    backgroundColor: '#f1f5f9', 
    borderRadius: 12, 
    marginTop: 8,
    overflow: 'hidden'
  },
  iosConfirmButton: {
    backgroundColor: '#6366f1',
    padding: 12,
    alignItems: 'center',
    marginTop: 0
  },
  iosConfirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },

  // 详情卡片
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  detailsList: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  detailIconInfo: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  detailIconSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  detailContent: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  detailDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
});