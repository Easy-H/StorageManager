import React from 'react';
import { styles } from '../../styles';
import { View, TextInput } from 'react-native';

const SearchBar = ({ value, onChange }) => (
  <View style={{flex: 1}}>
    <TextInput
      placeholder="품목 이름 검색..." 
      value={value}
      onChange={e => onChange(e.target.value)} 
      style={styles.searchInput}
    />
  </View>
);

export default SearchBar;