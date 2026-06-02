import { User } from 'firebase/auth';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { H2, H3 } from '../common/components/ui/react-native/common';
import OrgList from '../features/org/components/OrgList';
import { useOrg } from '../features/org/hooks/useOrg';
import { OrgMembership } from '../features/org/types';
import { Colors, styles } from '../styles';

import OrgActionButtons from '../features/org/components/OrgActionButtons';
import OrgUserFooter from '../features/org/components/OrgUserFooter';
import PublicOrgSearchSection from '../features/org/components/PublicOrgSearchSection';

interface OrgSelectPageProps {
	user: User | null;
	userProfile: any;
	setCurrentOrg: (org: OrgMembership) => void;
	onLogout: () => void;
	navigate: (path: string) => void;
	notice: (msg: string) => void;
	onLogin: () => void;
}

function OrgSelectPage({ user, userProfile, setCurrentOrg, onLogout, navigate, notice, onLogin }: OrgSelectPageProps) {
	const [loading, setLoading] = useState(true); // 로딩 상태
	const { orgJoin, orgCreate } = useOrg(notice, user, userProfile); // user와 userProfile을 useOrg 훅에 전달

	return (
		<ScrollView contentContainerStyle={localStyle.orgContainer}>
			<View style={styles.appHeader}>
				<H2>🏢 조직 검색 및 선택</H2>
				{!user && (
					<TouchableOpacity onPress={onLogin} style={localStyle.headerLoginBtn}>
						<Text style={localStyle.headerLoginText}>로그인</Text>
					</TouchableOpacity>
				)}
			</View>

			{/* 공개 조직 검색 섹션 */}
			<PublicOrgSearchSection setCurrentOrg={(org) => {
				setCurrentOrg(org);
				navigate('/shop');
			}} />

			{/* 내 조직 목록 섹션 (로그인 시에만 노출) */}
			{user && (
				<View style={{ width: '100%', marginTop: 20 }}>
					<H3>📌 내 조직 목록</H3>
					<View style={{ width: '100%', marginTop: 10 }}>
						<OrgList
							onLoading={(val: boolean) => setLoading(val)}
							user={user}
							navigate={navigate}
							notice={notice}
							setCurrentOrg={setCurrentOrg}
						/>
					</View>
				</View>
			)}

			{/* 조직 생성/참여 버튼 섹션 */}
			<OrgActionButtons user={user} orgCreate={orgCreate} orgJoin={orgJoin} notice={notice} />

			{/* 하단 사용자 정보/로그아웃 섹션 */}
			<OrgUserFooter user={user} onLogout={onLogout} />
		</ScrollView>
	);
}
export const localStyle = StyleSheet.create({
	orgContainer: {
		width: '100%',
		maxWidth: 500,
		paddingTop: 50,
		alignSelf: 'center',
		padding: 20,
	} as ViewStyle,
	loginPrompt: {
		padding: 20,
		backgroundColor: '#f9f9f9',
		borderRadius: 12,
		alignItems: 'center',
		marginTop: 10,
		borderWidth: 1,
		borderColor: '#eee'
	} as ViewStyle,
	headerLoginBtn: {
		backgroundColor: Colors.primary,
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderRadius: 8,
	} as ViewStyle,
	headerLoginText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: 'bold',
	} as TextStyle,
});

export default OrgSelectPage;