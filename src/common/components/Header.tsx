import React from 'react';
import { styles } from '../../styles';
import { View, Text, TouchableOpacity, TextStyle } from 'react-native';

interface Organization {
    id: string;
    name: string;
}

interface HeaderProps {
    currentOrg: Organization;
    onBack: () => void;
    notice: (msg: string) => void;
}

const Header = ({ currentOrg, onBack, notice }: HeaderProps) => {
    const handleCopyOrgId = (id: string) => {
        navigator.clipboard.writeText(id)
            .then(() => notice("조직 코드가 복사되었습니다!")) // alert 대신 사용
            .catch(() => notice("복사 실패"));
    };

    return (
        <View style={styles.appHeader}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}><Text>◀ 조직변경</Text></TouchableOpacity>
            {/* @ts-ignore - Web cursor support */}
            <TouchableOpacity onPress={() => handleCopyOrgId(currentOrg.id)} style={{ cursor: 'pointer' }}>
                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'right' } as TextStyle}>
                        {currentOrg.name} 📋
                    </Text>
                </View>
                <View><Text style={{ fontSize: 10, color: '#888' } as TextStyle}>
                    ID: {currentOrg.id}</Text></View>
            </TouchableOpacity>
        </View>
    );
};

export default Header;