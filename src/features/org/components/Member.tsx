import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Button } from '../../../common/components/ui-brick';
import { Colors } from '../../../styles';
import { OrgMember, OrgRole } from '../types';

type MemberProps = {
    member: OrgMember;
    user: { uid: string };
    upgradeMemberLevel: (member: OrgMember, role: OrgRole) => void;
    removeMember: (uid: string) => void;
}

export const Member = ({ member, user, upgradeMemberLevel, removeMember }: MemberProps) => {
    const role = member.level === OrgRole.ADMIN ? 'admin' : 'member';
    const isPending = member.level === OrgRole.PENDING;
    const isMe = member.uid === user.uid;
    
    return (
        <View style={[localStyle.memberItemStyle, isMe && localStyle.isMeContainer]}>
            <View style={localStyle.infoSection}>
                <View style={localStyle.nameRow}>
                    <Text style={[localStyle.nameText, isMe && localStyle.isMeText]}>
                        {member.userName || member.name || member.email?.split('@')[0]}
                    </Text>
                    {isMe && (
                        <View style={localStyle.meBadge}>
                            <Text style={localStyle.meBadgeText}>나</Text>
                        </View>
                    )}
                    {isPending ? (
                        <View style={[localStyle.roleBadge, localStyle.pendingBadge]}>
                            <Text style={[localStyle.roleBadgeText, localStyle.pendingBadgeText]}>
                                ⏳ 승인 대기
                            </Text>
                        </View>
                    ) : (
                        <View style={[localStyle.roleBadge, role === 'admin' ? localStyle.adminBadge : localStyle.memberBadge]}>
                            <Text style={[localStyle.roleBadgeText, role === 'admin' ? localStyle.adminBadgeText : localStyle.memberBadgeText]}>
                                {role === 'admin' ? '👑 관리자' : '👤 멤버'}
                            </Text>
                        </View>
                    )}
                </View>
                <Text style={localStyle.emailText}>
                    {member.email}
                </Text>
            </View>
            {!isMe && (
                <View style={localStyle.actionSection}>
                    {isPending ? (
                        <Button 
                            onPress={() => upgradeMemberLevel(member, OrgRole.MEMBER)} 
                            style={[localStyle.actionBtn, localStyle.approveBtn]}
                        >
                            승인
                        </Button>
                    ) : (
                        <Button 
                            onPress={() => upgradeMemberLevel(member, role === 'admin' ? OrgRole.MEMBER : OrgRole.ADMIN)} 
                            style={[localStyle.actionBtn, localStyle.roleBtn]}
                        >
                            {role === 'admin' ? '멤버로 강등' : '관리자로 승격'}
                        </Button>
                    )}
                    <Button
                        onPress={() => removeMember(member.uid)}
                        style={[localStyle.actionBtn, localStyle.removeBtn]}
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
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    } as ViewStyle,
    isMeContainer: {
        backgroundColor: '#f0f7ff',
        borderColor: '#bae7ff',
    },
    infoSection: {
        flex: 1,
        gap: 2,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    nameText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#262626',
    },
    isMeText: {
        color: Colors.primary,
    },
    emailText: {
        fontSize: 12,
        color: '#8c8c8c',
    },
    meBadge: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 4,
    },
    meBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    roleBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
        borderWidth: 1,
    },
    roleBadgeText: {
        fontSize: 11,
        fontWeight: '600',
    },
    adminBadge: { backgroundColor: '#f6ffed', borderColor: '#b7eb8f' },
    adminBadgeText: { color: '#52c41a' },
    memberBadge: { backgroundColor: '#f5f5f5', borderColor: '#d9d9d9' },
    memberBadgeText: { color: '#595959' },
    pendingBadge: { backgroundColor: '#fff7e6', borderColor: '#ffd591' },
    pendingBadgeText: { color: '#fa8c16' },
    
    actionSection: {
        flexDirection: 'row',
        gap: 6,
    },
    actionBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        justifyContent: 'center',
        borderWidth: 1,
        fontSize: 12,
    } as ViewStyle & TextStyle,
    roleBtn: {
        backgroundColor: '#fff',
        borderColor: '#d9d9d9',
        color: '#595959',
    },
    approveBtn: {
        backgroundColor: '#52c41a',
        borderColor: '#52c41a',
        color: '#fff',
    },
    removeBtn: {
        backgroundColor: '#fff',
        borderColor: '#ffccc7',
        color: '#ff4d4f',
    },
});