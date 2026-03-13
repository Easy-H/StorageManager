import React, { useState, useEffect } from 'react';
import Header from '../common/components/Header';
import { useOrgManage } from '../features/org/hooks/useOrgManage';
import { Member } from '../features/org/components/Member';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles';

const AdminPage = ({ currentOrg, notice, user, onBack }) => {
    const [newName, setNewName] = useState(currentOrg.name);
    const { members, deleteOrg, removeMember, updateOrgName, upgradeMemberLevel }
        = useOrgManage(currentOrg, notice);

    return (
        <>
            <Header currentOrg={currentOrg} onBack={onBack} notice={notice} />
            <View style={ styles.appContent }>

                {/* 1. 조직 정보 수정 */}
                <Text style={styles.h3}>🏷️ 조직 이름 변경</Text>
                <View style={ViewStyle}>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                        <input
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            className="input-basic"
                            style={{ flex: 1 }}
                        />
                        <TouchableOpacity
                            onClick={() => updateOrgName(currentOrg.id, newName)}
                            style={[styles.greenButton]}
                        >
                            <Text style={styles.buttonText}>수정</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 2. 멤버 관리 */}
                <Text style={styles.h3}>👤 멤버 및 권한 관리</Text>
                <View style={ViewStyle}>
                    <View style={{ display: 'flex',
                        flexDirection: 'column', gap: '10px' }}>
                        {members.map(member => {
                            return (
                                <Member key={member.uid}
                                    member={member}
                                    user={user}/>)
                                ;
                        })}
                    </View>
                </View>

                {/* 3. 위험 구역 */}
                <Text style={{ ...styles.h3, color: '#ff4d4f'}}>🚨 위험 구역</Text>
                <View style={{ ...ViewStyle, border: '1px solid #ffccc7', backgroundColor: '#fff2f0' }}>
                    <p style={{ fontSize: '12px', color: '#ff7875', marginBottom: '10px' }}>
                        조직을 삭제하면 재고 데이터와 모든 로그가 영구 삭제됩니다.
                    </p>
                    <TouchableOpacity onClick={deleteOrg} className="link-TouchableOpacity">
                        <Text style={{ color: '#ff4d4f', fontWeight: 'bold', padding: 0 }}>조직 전체 삭제하기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

export const localStyle = StyleSheet.create({});
// --- 스타일 객체 (기본 디자인 유지) ---
const ViewStyle = {
    background: '#fff',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    border: '1px solid #eeeeee'
};

export default AdminPage;