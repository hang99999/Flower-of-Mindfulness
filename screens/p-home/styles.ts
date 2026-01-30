

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // 为底部导航栏留出空间
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleSection: {
    flex: 1,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: -10,   // 向下移 10 像素 (想向上移就写负数，如 -10)
    marginLeft: 10,  // 向右移 20 像素
   marginBottom: 20, // 撑开下方的间距
  },
  appSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },

  welcomeSection: {
    paddingHorizontal: 24,
    marginTop: -32,
    position: 'relative',
    zIndex: 10,
  },
  welcomeCard: {
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
        elevation: 4,
      },
    }),
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  welcomeIcon: {
    width: 64,
    height: 28,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainFeatures: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  mainActions: {
    gap: 16,
    marginBottom: 32,
  },
  meditationCard: {
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
        elevation: 4,
      },
    }),
  },
  meditationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meditationInfo: {
    flex: 1,
  },
  meditationIconSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  meditationIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  meditationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  meditationSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 10, 
  },
  meditationStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  todayPractice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#6b7280',
  },
  meditationArrow: {
    marginLeft: 16,
  },
  recordCard: {
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
        elevation: 4,
      },
    }),
  },
  recordContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recordInfo: {
    flex: 1,
  },
  recordIconSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  recordSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 10,
  },
  recordStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  todayMood: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordArrow: {
    marginLeft: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  historyCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  historyContent: {
    alignItems: 'center',
  },
  historyIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  historySubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  reminderCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  reminderContent: {
    alignItems: 'center',
  },
  reminderIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  reminderSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  dailyRecommendation: {
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
        elevation: 4,
      },
    }),
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },

  recommendationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationAudioTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  recommendationAudioDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  recommendationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  audioDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  audioCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  playRecommendation: {
    width: 48,
    height: 48,
    backgroundColor: '#6366f1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  playIcon: {
    marginLeft: 2,
  },
});

