import React, { useState } from 'react';

import OrgList from '../features/org/components/OrgList';
import { useOrg } from '../features/org/hooks/useOrg'; // useOrg 훅에서 user와 userProfile을 직접 가져오지 않도록 수정
import { View, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import { styles } from '../styles';
import { GreenButton, BlueButton } from '../common/components/ui/react-native/custom';
import { Button, H2 } from '../common/components/ui/react-native/common';
import { OrgMembership } from '../features/org/types';
import { User } from 'firebase/auth';

interface OrgSelectPageProps {
	user: User | null;
	userProfile: any;
	setCurrentOrg: (org: OrgMembership) => void;
	onLogout: () => void;
	navigate: (path: string) => void;
	notice: (msg: string) => void;
}

function OrgSelectPage({ user, userProfile, setCurrentOrg, onLogout, navigate, notice }: OrgSelectPageProps) {
	const [loading, setLoading] = useState(true); // 로딩 상태

	const { orgJoin, orgCreate } = useOrg(notice, user, userProfile); // user와 userProfile을 useOrg 훅에 전달

	return (
		<View style={localStyle.orgContainer}>
			<View style={styles.appHeader}>
				<H2>🏢 내 조직 목록</H2>
			</View>

			<OrgList
				onLoading={(val: boolean) => setLoading(val)}
				user={user}
				navigate={navigate}
				notice={notice}
				setCurrentOrg={setCurrentOrg}
			/>

			<View style={localStyle.buttons}>
				<GreenButton onPress={() => {
					const orgName = prompt("생성할 조직의 이름을 입력하세요:");
					if (orgName && user) {
						orgCreate(orgName);
					} else if (!user) {
						notice("로그인 정보가 없습니다.");
					}
				}}
					style={{ flex: 1 } as ViewStyle}>
					조직 생성
				</GreenButton>
				<BlueButton onPress={() => {
					const orgId = prompt("참여할 조직의 ID를 입력하세요:");
					if (orgId && user) {
						orgJoin(orgId);
					} else if (!user) {
						notice("로그인 정보가 없습니다.");
					}
				}}
					style={{ flex: 1 } as ViewStyle}>
					조직 참여
				</BlueButton>
			</View>

			<View style={localStyle.profileHeader}>
				<View>
					<Text style={localStyle.authLabel}>
						로그인 계정</Text>
					<Text style={localStyle.authEMail}>{user?.email}</Text>
				</View>
				
				<Button onPress={onLogout} style={localStyle.logout}>
					로그아웃
				</Button>
			</View>
		</View>
	);
}
export const localStyle = StyleSheet.create({
	orgContainer: {
		width: '100%',
		maxWidth: 500,
		marginTop: 50,
		alignSelf: 'center',
		padding: 20,
		gap: 10,
		alignItems: 'center',
	} as ViewStyle,
	buttons: {
		flexDirection: "row",
		width: "100%",
		gap: 10
	},
	profileHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 10,
		paddingBottom: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#eeeeee',
		width: "100%",
	} as ViewStyle,
	logout: {
		// @ts-ignore
		color: '#ff4d4f',
		fontSize: 13,
		backgroundColor: 'transparent',
	} as ViewStyle & TextStyle,
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