import { StyleSheet, View, Text } from 'react-native';
import { Button } from '../../../common/components/ui/react-native/common';

export const Member = ({ member, user }) => {
    const role = member.level == 100 ? 'admin' : 'member';
    const isMe = member.uid === user.uid;
    return (
        <View style={localStyle.memberItemStyle}>
            <View>
                <Text style={{ fontWeight: 'bold', color: '#242424' }}>
                    {member.userName || member.name || member.email} {isMe && "(나)"}
                </Text>
                <View>
                    <Text style={{ fontSize: '12px', color: '#888' }}>
                        {role === 'admin' ? '👑 관리자' : '👤 멤버'}</Text>
                </View>
            </View>
            {!isMe && (
                <View style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                    <Button onClick={() => upgradeMemberLevel(member, role)} style={localStyle.roleBtnStyle}>
                            {role === 'admin' ? '멤버로 강등' : '관리자로 승격'}
                    </Button>
                    <Button
                        onClick={() => removeMember(member.uid)}
                        style={{ ...localStyle.removeBtnStyle, color: 'red' }}
                    >
                        내보내기
                    </Button>
                </View>
            )}
        </View>
    );
}

export const localStyle = StyleSheet.create({
    memberItemStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 9,
        borderBottomColor: '#f6f6f6',
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
    }, 
    roleBtnStyle: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        cursor: 'pointer',
        borderRadius: 6,
        justifyContent: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#52c41a',
        fontSize: 12,
        color: 'white',
        fontWeight: 'bold',
    }, 
    removeBtnStyle: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        fontSize: 12,
        cursor: 'pointer',
        justifyContent: 'center',
        borderRadius: 6,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: 'white'
    }
});