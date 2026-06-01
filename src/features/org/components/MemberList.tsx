import React from 'react';
import { View, ViewStyle, Text, StyleSheet } from 'react-native';
import { Member } from './Member';
import { OrgMember, OrgRole } from '../types';
import { User } from 'firebase/auth';

type MemberListProps = {
    members: OrgMember[];
    user: User | null;
    upgradeMemberLevel: (member: OrgMember, role: OrgRole) => void;
    onRemoveMember: (member: OrgMember) => void;
}

const MemberList = ({ members, user, upgradeMemberLevel, onRemoveMember }: MemberListProps) => {
    return (
        <View style={localStyles.container}>
            {members.length === 0 ? (
                <View style={localStyles.emptyContainer}>
                    <Text style={localStyles.emptyText}>참여 중인 멤버가 없습니다.</Text>
                </View>
            ) : (
                members.map(member => (
                    <Member 
                        key={member.uid}
                        member={member}
                        user={user as any}
                        upgradeMemberLevel={upgradeMemberLevel}
                        removeMember={(uid) => {
                            const target = members.find(m => m.uid === uid);
                            if (target) onRemoveMember(target);
                        }}
                    />
                ))
            )}
        </View>
    );
};

const localStyles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 10,
    } as ViewStyle,
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#bfbfbf',
        fontSize: 14,
    },
});

export default MemberList;