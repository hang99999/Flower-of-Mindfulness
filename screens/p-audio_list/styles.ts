

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
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
  titleSection: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  categorySection: {
    paddingHorizontal: 24,
    marginTop: -20,
    position: 'relative',
    zIndex: 10,
  },
  categoryTabs: {
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
        elevation: 2,
      },
    }),
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryTabActive: {
    backgroundColor: '#6366f1',
  },
  categoryTabInactive: {
    backgroundColor: '#f3f4f6',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTabTextActive: {
    color: '#ffffff',
  },
  categoryTabTextInactive: {
    color: '#6b7280',
  },
  audioListSection: {
    paddingHorizontal: 24,
    marginTop: 32,
    paddingBottom: 20,
  },
  audioListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  audioCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  audioList: {
    gap: 16,
  },
  audioItem: {
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
        elevation: 2,
      },
    }),
  },
  audioItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16,
  },
  audioInfo: {
    flex: 1,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  audioDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  audioMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  audioMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  audioMetaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  playButton: {
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
        elevation: 3,
      },
    }),
  },
  playIcon: {
    marginLeft: 2,
  },
});

