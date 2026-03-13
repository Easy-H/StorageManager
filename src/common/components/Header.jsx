import { styles, Colors } from '../../styles';
import { View, Text, TouchableOpacity, Platform, Alert, StyleSheet, Dimensions } from 'react-native';

const Header = ({ currentOrg, onBack, notice }) => {
    const handleCopyOrgId = (id) => {
    navigator.clipboard.writeText(id)
      .then(() => notice("조직 코드가 복사되었습니다!")) // alert 대신 사용
      .catch(() => notice("복사 실패"));
  };

  return (
    <View style={ styles.appHeader }>
      <TouchableOpacity onPress={onBack} style={styles.backButton}><Text>◀ 조직변경</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => handleCopyOrgId(currentOrg.id)} style={{ cursor: 'pointer'}}>
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: '15px', textAlign: 'right'  }}>{currentOrg.name} 📋</Text></View>
        <View><Text style={{ fontSize: '10px', color: '#888' }}>
          ID: {currentOrg.id}</Text></View>
      </TouchableOpacity>
    </View>
  );
};

export default Header;