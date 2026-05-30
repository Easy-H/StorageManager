import React from 'react';
import { StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import { Button } from '../../../common/components/ui/react-native/common';
import { OrgMember, OrgRole } from '../types';

interface MemberProps {
    member: OrgMember;
    user: { uid: string };
    upgradeMemberLevel: (member: OrgMember, role: OrgRole) => void;
    removeMember: (uid: string) => void;
}

export const Member = ({ member, user, upgradeMemberLevel, removeMember }: MemberProps) => {
    const role = member.level === OrgRole.ADMIN ? 'admin' : 'member';
    const isMe = member.uid === user.uid;
    
    return (
        <View style={localStyle.memberItemStyle}>
            <View>
                <Text style={{ fontWeight: 'bold', color: '#242424' }}>
                    {member.userName || member.name || member.email} {isMe && "(나)"}
                </Text>
                <View>
                    <Text style={{ fontSize: 12, color: '#888' } as TextStyle}>
                        {role === 'admin' ? '👑 관리자' : '👤 멤버'}</Text>
                </View>
            </View>
            {!isMe && (
                <View style={{ flexDirection: 'row', gap: 5 } as ViewStyle}>
                    <Button 
                        onPress={() => upgradeMemberLevel(member, role === 'admin' ? OrgRole.MEMBER : OrgRole.ADMIN)} 
                        style={localStyle.roleBtnStyle}
                    >
                        {role === 'admin' ? '멤버로 강등' : '관리자로 승격'}
                    </Button>
                    <Button
                        onPress={() => removeMember(member.uid)}
                        style={[localStyle.removeBtnStyle, { color: 'red' } as TextStyle]}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 9,
        borderBottomColor: '#f6f6f6',
        borderBottomWidth: 1,
    } as ViewStyle, 
    roleBtnStyle: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#52c41a',
        fontSize: 12,
        color: 'white',
        fontWeight: 'bold',
        // @ts-ignore
        cursor: 'pointer',
    }, 
    removeBtnStyle: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        fontSize: 12,
        justifyContent: 'center',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: 'white',
        // @ts-ignore
        cursor: 'pointer',
    } as ViewStyle & TextStyle
});