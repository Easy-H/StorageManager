import { StyleSheet, Text, TextStyle, TouchableOpacity, View } from 'react-native';
import { Button } from './ui/react-native/common';
import { vars } from './ui';

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
        <View style={localStyles.appHeader}>
            <Button onPress={onBack} style={localStyles.backButton}>
                ◀ 조직변경
            </Button>
            {/* @ts-ignore - Web cursor support */}
            <TouchableOpacity onPress={() => handleCopyOrgId(currentOrg.id)} style={{ cursor: 'pointer' }}>
                <View>
                    <Text style={{ color: vars.text, fontWeight: 'bold', fontSize: 15, textAlign: 'right' } as TextStyle}>
                        {currentOrg.name} 📋
                    </Text>
                </View>
                <View><Text style={{ fontSize: 10, color: '#888' } as TextStyle}>
                    ID: {currentOrg.id}</Text></View>
            </TouchableOpacity>
        </View>
    );
};

const localStyles = StyleSheet.create({
    appHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        backgroundColor: vars.background,
        borderBottomColor: vars.surface,
    },
    backButton: {
        fontSize: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: vars.box,
        borderRadius: 6,
        color: vars.text,
    }
});

export default Header;