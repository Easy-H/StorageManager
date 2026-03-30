import React from 'react';
import { styles } from '../../styles';
import { View, TextInput } from 'react-native';

const SearchBar = ({ value, onChange, placeholder }) => (
  <View style={{flex: 4}}>
    <TextInput
      placeholder={placeholder} 
      value={value}
      onChange={e => onChange(e.target.value)} 
      style={styles.searchInput}
    />
  </View>
);

export default SearchBar;