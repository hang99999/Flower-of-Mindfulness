

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  
  scrollView: {
    flex: 1,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },

  // 顶部导航栏
  headerGradient: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  headerButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },

  // 音频信息区域
  audioInfoSection: {
    paddingHorizontal: 24,
    marginTop: -20,
    position: 'relative',
    zIndex: 10,
    marginBottom: 32,
  },
  
  audioInfoCard: {
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
  
  audioCoverSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  
  audioVisualizer: {
    width: 192,
    height: 192,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  
  audioCover: {
    width: 160,
    height: 160,
    borderRadius: 16,
  },
  
  playIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  playIndicatorInner: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  playIndicatorIcon: {
    marginLeft: 4,
  },
  
  audioDetails: {
    alignItems: 'center',
    marginBottom: 24,
  },
  
  audioFullTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  
  audioDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  
  audioMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  
  audioMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  audioMetaText: {
    fontSize: 14,
    color: '#6b7280',
  },

  // 播放控制区域
  playbackControlsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  
  controlsCard: {
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
  
  progressSection: {
    marginBottom: 24,
  },
  
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  progressTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  
  progressContainer: {
    position: 'relative',
    height: 20,
    justifyContent: 'center',
  },
  
  progressTrack: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 8,
  },
  
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  
  progressSlider: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: 20,
  },
  
  progressSliderThumb: {
    backgroundColor: '#6366f1',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#ffffff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  
  controlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 24,
  },
  
  stopButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  //上下曲键，已注释
  // prevNextButton: {
  //   width: 56,
  //   height: 56,
  //   backgroundColor: '#f3f4f6',
  //   borderRadius: 28,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  
  playPauseButton: {
    width: 80,
    height: 80,
    backgroundColor: '#6366f1',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  
  playIconAdjustment: {
    marginLeft: 4,
  },
  
  //注释了重播键等
  // repeatButton: {
  //   width: 48,
  //   height: 48,
  //   backgroundColor: '#f3f4f6',
  //   borderRadius: 24,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  
  // additionalControls: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },
  
  // additionalControlButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   gap: 8,
  //   paddingHorizontal: 16,
  //   paddingVertical: 8,
  //   backgroundColor: '#f3f4f6',
  //   borderRadius: 20,
  // },
  
  // additionalControlText: {
  //   fontSize: 14,
  //   color: '#6b7280',
  // },

  // // 推荐练习
  // recommendedSection: {
  //   paddingHorizontal: 24,
  //   marginBottom: 32,
  // },
  
  // recommendationsTitle: {
  //   fontSize: 18,
  //   fontWeight: '600',
  //   color: '#1f2937',
  //   marginBottom: 16,
  // },
  
  // recommendationsList: {
  //   gap: 12,
  // },
  
  // recommendationItem: {
  //   backgroundColor: '#ffffff',
  //   borderRadius: 12,
  //   padding: 16,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   ...Platform.select({
  //     ios: {
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.06,
  //       shadowRadius: 8,
  //     },
  //     android: {
  //       elevation: 4,
  //     },
  //   }),
  // },
  
  // recommendationImage: {
  //   width: 48,
  //   height: 48,
  //   borderRadius: 8,
  //   marginRight: 16,
  // },
  
  // recommendationInfo: {
  //   flex: 1,
  // },
  
  // recommendationTitle: {
  //   fontSize: 14,
  //   fontWeight: '500',
  //   color: '#1f2937',
  //   marginBottom: 4,
  // },
  
  // recommendationDescription: {
  //   fontSize: 12,
  //   color: '#6b7280',
  // },
  
  // recommendationPlayButton: {
  //   width: 32,
  //   height: 32,
  //   backgroundColor: '#6366f1',
  //   borderRadius: 16,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  
  // recommendationPlayIcon: {
  //   marginLeft: 2,
  // },
});

