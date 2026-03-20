import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';

const TodoItem = ({ item, onExecute }) => (
  <View style={styles.orgCard}> {/* 기존 orgCard 스타일 재활용 가능 */}
    <View>
      <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
      <Text style={{ fontSize: 12, color: '#666' }}>
        {item.type === 'IN' ? '입고' : '출고'} 예정 항목: {item.items.length}개
      </Text>
    </View>
    
    <TouchableOpacity 
      style={[styles.primaryButton, { paddingVertical: 8 }]} 
      onPress={() => onExecute(item.id)}
    >
      <Text style={{ color: '#fff', fontSize: 12 }}>실행</Text>
    </TouchableOpacity>
  </View>
);

export default TodoItem;