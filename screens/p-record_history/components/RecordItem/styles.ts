// p-record_history/components/RecordItem/styles.ts
import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  recordCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  
  // --- 卡片上半部分 ---
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 6,
  },
  timeText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '400',
    marginLeft: 4,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },

  // --- 卡片下半部分 (防重叠布局) ---
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 左右推开
    alignItems: 'flex-start',        // 顶部对齐
  },
  
  // 左侧信息
  cardLeftInfo: {
    flex: 1, 
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginRight: 16, // 给右边留空隙
  },
  infoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6b7280',
  },

  // 右侧感受文字
  cardRightInfo: {
    maxWidth: '45%', // 限制最大宽度
    alignItems: 'flex-start',
  },
  feelingText: {
    fontSize: 13,
    color: '#4b5563',
    textAlign: 'left',
    lineHeight: 20,
  },
});