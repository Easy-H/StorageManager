import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

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
                    <TouchableOpacity onClick={() => upgradeMemberLevel(member, role)} style={localStyle.roleBtnStyle}>
                        <Text style={localStyle.roleBtnTextStyle}>
                            {role === 'admin' ? '멤버로 강등' : '관리자로 승격'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onClick={() => removeMember(member.uid)}
                        style={{ ...localStyle.removeBtnStyle, color: 'red' }}
                    >
                        <Text style={{
                            ...localStyle.roleBtnTextStyle,
                            color: 'red'
                        }}>
                            내보내기</Text>
                    </TouchableOpacity>
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
        paddingHorizontal: '8',
        paddingVertical: '0',
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
    }, 
    roleBtnTextStyle: {
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