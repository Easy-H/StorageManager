import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 1. CSS 변수를 상수로 정의
export const Colors = {
  primary: '#1890ff',
  secondary: '#242424',
  bgWhite: '#f9f9f9',
  bgLight: '#f0f7ff',
  borderColor: '#dddddd',
  errorRed: '#ff4d4f',
  successGreen: '#52c41a',
  white: '#ffffff',
  gray: '#888888',
};

export const styles = StyleSheet.create({
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  // 기본 레이아웃 및 배경
  h3: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgWhite,
  },
  appWrapper: {
    ...Platform.select({
    web: { height: '100vh' },
    default: { height: '100%' }
  }),
  },
  appContent: {
    flex: 1,
    width: '100%',
    maxWidth: 500, // 웹 환경 대응
    alignSelf: 'center',
    backgroundColor: Colors.bgWhite,
    position: 'relative',
    color: 'black',
    padding: 10,
    gap: 10,
  },

  // 인증(로그인/가입) 박스
  authBox: {
    width: '90%',
    maxWidth: 350,
    marginVertical: 80,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 15,
    backgroundColor: Colors.white,
    // box-shadow 대신 RN 그림자 설정
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 4 },
    }),
  },
  formStack: {
    width: '100%',
    gap: 12,
  },
  inputBasic: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    fontSize: 20,
    backgroundColor: Colors.white,
    color: Colors.secondary,
  },

  // 조직 선택 화면
  orgContainer: {
    width: '100%',
    maxWidth: 400,
    marginVertical: 50,
    alignSelf: 'center',
    padding: 20,
    alignItems: 'center',
  },
  orgList: {
    width: '100%',
    gap: 12,
    marginVertical: 20,
  },
  orgCard: {
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.bgLight,
  },
  orgCardText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  roleTag: {
    fontSize: 11,
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.primary,
    color: Colors.primary,
  },

  // 버튼 스타일
  primaryButton: {
    padding: 14,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  greenButton: {
    flex: 1,
    padding: 14,
    backgroundColor: Colors.successGreen,
    borderRadius: 8,
    color: Colors.white,
    alignItems: 'center',
    justifyContent: 'center'
  },
  blueButton: {
    flex: 1,
    padding: 14,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    color: Colors.white,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  linkButton: {
    color: Colors.gray,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 14,
    alignContent: 'center',
  },

  // 헤더 및 검색
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  backButton: {
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    color: Colors.secondary,
  },
  activeOrgText: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  searchSection: {
    gap: 6,
    flexDirection: 'row'
  },
  searchInput: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    backgroundColor: '#fcfcfc',
    color: Colors.secondary,
    fontSize: 20,
    padding: 10,
  },

  // 리스트 아이템
  productList: {
    flex: 1
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f6f6f6',
    backgroundColor: Colors.white,
    display: 'flex',
    cursor: 'pointer'
  },
  buttonRowFloating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    zIndex: 10,
    padding: 20,
  },
  lowStock: {
    color: Colors.errorRed,
  },

  // 모달 시스템
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: Colors.white,
    width: '100%',
    maxWidth: 400,
    padding: 25,
    gap: 20,
    borderRadius: 20,
  },
  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginVertical: 10,
  },
  removeBtn: {
    
  },
  closeModalBtn: {
    backgroundColor: 'none',
    borderColor: 'none',
  },
  closeModalBtnText: {
    color: '#888',
    textDecorationLine: 'underline',
    cursor: 'pointer',
    fontSize: 14,
    textAlign: 'center'
  },
  circleQtyBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyDisplayInput: {
    width: 90,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
    color: Colors.secondary,
  },
  
  // 스캐너 및 모드 토글
  reader: {
    backgroundColor: '#000000',
    borderRadius: 12,
    overflow: 'hidden',
    height: 250, // 웹 라이브러리 연동 시 높이 필요
  },
  modeToggleBtn: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    color: '#666',
  }
});