import { User } from 'firebase/auth';
import { useState } from 'react';
import { ScrollView, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import Header from '../common/components/Header';
import { H3 } from '../common/components/ui/react-native/common';
import { Box, GreenButton } from '../common/components/ui/react-native/custom';
import MemberList from '../features/org/components/MemberList';
import { useOrgManage } from '../features/org/hooks/useOrgManage';
import { OrgMembership } from '../features/org/types';
import { styles } from '../styles';

interface AdminPageProps {
    currentOrg: OrgMembership;
    notice: (msg: string) => void;
    user: User | null;
    onBack: () => void;
    setCurrentOrg: (org: OrgMembership) => void;
}

const AdminPage = ({ currentOrg, notice, user, onBack, setCurrentOrg }: AdminPageProps) => {
    const [newName, setNewName] = useState(currentOrg.name);
    
    // useOrgManage.ts 정의에 맞춰 5개의 인자를 모두 전달합니다.
    const { members, deleteOrg, removeMember, updateOrgName, upgradeMemberLevel }
        = useOrgManage(currentOrg, setCurrentOrg, notice, user, onBack);

    return (
        <>
            <Header currentOrg={currentOrg} onBack={onBack} notice={notice} />
            <ScrollView contentContainerStyle={ styles.appContent }>

                {/* 1. 조직 정보 수정 */}
                <H3>🏷️ 조직 이름 변경</H3>
                <Box>
                    <View style={{ flexDirection: 'row', gap: 8 } as ViewStyle}>
                        {/* @ts-ignore - React Native Web 전용 input 태그 사용 */}
                        <input
                            value={newName}
                            onChange={(e: any) => setNewName(e.target.value)}
                            className="input-basic"
                            style={{ flex: 1 }}
                        />
                        <GreenButton
                            onPress={() => updateOrgName(newName)}>
                            수정
                        </GreenButton>
                    </View>
                </Box>

                {/* 2. 멤버 관리 */}
                <H3>👤 멤버 및 권한 관리</H3>
                <Box>
                    <MemberList 
                        members={members}
                        user={user}
                        upgradeMemberLevel={upgradeMemberLevel}
                        onRemoveMember={removeMember}
                    />
                </Box>

                {/* 3. 위험 구역 */}
                <H3 style={{ color: '#ff4d4f' } as TextStyle}>🚨 위험 구역</H3>
                <Box style={{ borderWidth: 1, borderColor: '#ffccc7', backgroundColor: '#fff2f0' } as ViewStyle}>
                    {/* @ts-ignore - Web p tag */}
                    <p style={{ fontSize: '12px', color: '#ff7875', marginBottom: '10px' }}>
                        조직을 삭제하면 재고 데이터와 모든 로그가 영구 삭제됩니다.
                    </p>
                    <TouchableOpacity onPress={deleteOrg}>
                        <Text style={{ color: '#ff4d4f', fontWeight: 'bold', padding: 0 }}>조직 전체 삭제하기</Text>
                    </TouchableOpacity>
                </Box>
            </ScrollView>
        </>
    );
};
export default AdminPage;