import React, { useState, useEffect } from 'react';
import Header from '../common/components/Header';
import { useOrgManage } from '../features/org/hooks/useOrgManage';
import { Member } from '../features/org/components/Member';
import { ScrollView, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { styles, Colors } from '../styles';
import { Button, H3 } from '../common/components/ui/react-native/common';
import { Box, GreenButton } from '../common/components/ui/react-native/custom';

const AdminPage = ({ currentOrg, notice, user, onBack, setCurrentOrg }) => {
    const [newName, setNewName] = useState(currentOrg.name);
    const { members, deleteOrg, removeMember, updateOrgName, upgradeMemberLevel }
        = useOrgManage(currentOrg, setCurrentOrg, notice);

    return (
        <>
            <Header currentOrg={currentOrg} onBack={onBack} notice={notice} />
            <ScrollView contentContainerStyle={ styles.appContent }>

                {/* 1. 조직 정보 수정 */}
                <H3>🏷️ 조직 이름 변경</H3>
                <Box>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
                        <input
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
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
                    <View style={{ display: 'flex',
                        flexDirection: 'column', gap: 10 }}>
                        {members.map(member => {
                            return (
                                <Member key={member.uid}
                                    member={member}
                                    user={user}/>)
                                ;
                        })}
                    </View>
                </Box>

                {/* 3. 위험 구역 */}
                <H3 style={{color: '#ff4d4f'}}>🚨 위험 구역</H3>
                <Box style={{ border: '1px solid #ffccc7', backgroundColor: '#fff2f0' }}>
                    <p style={{ fontSize: '12px', color: '#ff7875', marginBottom: '10px' }}>
                        조직을 삭제하면 재고 데이터와 모든 로그가 영구 삭제됩니다.
                    </p>
                    <TouchableOpacity onClick={deleteOrg} className="link-TouchableOpacity">
                        <Text style={{ color: '#ff4d4f', fontWeight: 'bold', padding: 0 }}>조직 전체 삭제하기</Text>
                    </TouchableOpacity>
                </Box>
            </ScrollView>
        </>
    );
};

export default AdminPage;