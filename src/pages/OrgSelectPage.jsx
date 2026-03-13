import React, { useState, useEffect } from 'react';

import OrgList from '../features/org/components/OrgList';
import { useOrg } from '../features/org/hooks/useOrg';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles';

function OrgSelectPage({ user, userProfile, setCurrentOrg, onLogout, navigate, notice }) {
	const [loading, setLoading] = useState(true); // 로딩 상태

	const { orgJoin, orgCreate } = useOrg(notice);

	return (
		<View style={localStyle.orgContainer}>
			<View style={styles.appHeader}>
				<Text style={styles.h2}>🏢 내 조직 목록</Text>
			</View>

			<OrgList
				onLoading={setLoading}
				user={user}
				navigate={navigate}
				notice={notice}
				setCurrentOrg={setCurrentOrg}
			/>

			<View style={localStyle.buttons}>
				<TouchableOpacity onPress={() => orgJoin()}
					style={[styles.greenButton, {flex: 1}]}>
					<Text style={styles.buttonText}>조직 생성</Text></TouchableOpacity>
				<TouchableOpacity onPress={() => orgCreate}
					style={[styles.blueButton, {flex: 1}]}>
					<Text style={styles.buttonText}>조직 참여</Text></TouchableOpacity>
			</View>

			<View style={localStyle.profileHeader}>
				<View style={{ textAlign: 'left' }}>
					<Text style={localStyle.authLabel}>
						로그인 계정</Text>
					<Text style={localStyle.authEMail}>{user?.email}</Text>
				</View>
				{/* 이 부분의 </TouchableOpacity> 태그가 </View>로 되어 있었을 수 있습니다 */}
				<TouchableOpacity
					onPress={onLogout}
					className="link-TouchableOpacity"
				>
					<Text style={localStyle.logout}>로그아웃</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
export const localStyle = StyleSheet.create({
	orgContainer: {
		width: '100%',
		maxWidth: 500,
		marginVertical: 50,
		alignSelf: 'center',
		padding: 20,
		gap: 10,
		alignItems: 'center',
	},
	buttons: {
		flexDirection: "row",
		width: "100%",
		gap: 10
	},
	profileHeader: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 10,
		paddingBottom: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#eeeeee',
		width: "100%",
	},
	logout: {
		color: '#ff4d4f',
		fontSize: 13,
		border: 'none',
		backgroundColor: 'none',
		cursor: 'pointer'
	},
	authLabel: {
		fontSize: 12,
		color: '#888'
	},
	authEMail: {
		fontSize: 14,
		fontWeight: 600
	},

});

export default OrgSelectPage;