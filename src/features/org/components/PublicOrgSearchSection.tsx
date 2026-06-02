import React, { useState, useEffect, FC } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { H3 } from '../../../common/components/ui-brick';
import SearchBar from '../../../common/components/SearchBar';
import { FirebaseOrgRepository as OrgAPI } from '../api/FirebaseOrgRepository';
import { OrgMembership } from '../types';
import { Colors } from '../../../styles';

interface PublicOrgSearchSectionProps {
	setCurrentOrg: (org: OrgMembership) => void;
}

const PublicOrgSearchSection: FC<PublicOrgSearchSectionProps> = ({ setCurrentOrg }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [publicOrgs, setPublicOrgs] = useState<OrgMembership[]>([]);

	useEffect(() => {
		const delayDebounceFn = setTimeout(async () => {
			if (searchTerm.trim()) {
				const results = await OrgAPI.searchPublicOrgs(searchTerm);
				setPublicOrgs(results);
			} else {
				setPublicOrgs([]);
			}
		}, 300);

		return () => clearTimeout(delayDebounceFn);
	}, [searchTerm]);

	return (
		<View style={{ width: '100%', marginBottom: 20 }}>
			<View style={{ width: '100%', marginBottom: 15 }}>
				<SearchBar
					placeholder="공개 조직 이름으로 검색..."
					value={searchTerm}
					onChange={setSearchTerm}
				/>
			</View>

			{searchTerm.trim() !== "" && (
				<>
					<H3>🔍 공개 조직 검색 결과</H3>
					<View style={{ width: '100%', marginTop: 10 }}>
						{publicOrgs.length > 0 ? (
							publicOrgs.map(org => (
								<View key={org.id} style={styles.orgItem}>
									<View style={styles.infoSection}>
										<Text style={styles.orgName}>{org.name}</Text>
										<View style={styles.publicTag}>
											<Text style={styles.publicTagText}>공개</Text>
										</View>
									</View>
									<TouchableOpacity
										onPress={() => setCurrentOrg(org)}
										style={styles.visitButton}>
										<Text style={styles.visitButtonText}>방문하기</Text>
									</TouchableOpacity>
								</View>
							))
						) : (
							<Text style={{ color: '#888', padding: 10 }}>검색된 공개 조직이 없습니다.</Text>
						)}
					</View>
				</>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	orgItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 15,
		borderWidth: 1,
		borderColor: '#eee',
		borderRadius: 10,
		marginBottom: 10,
		backgroundColor: Colors.bgLight,
	} as ViewStyle,
	infoSection: { flexDirection: 'row', alignItems: 'center', gap: 8 } as ViewStyle,
	orgName: { fontSize: 16, fontWeight: 'bold', color: Colors.primary } as TextStyle,
	publicTag: { backgroundColor: '#f0f0f0', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4 } as ViewStyle,
	publicTagText: { color: '#888', fontSize: 10 } as TextStyle,
	orgId: { fontSize: 11, color: '#aaa', fontFamily: 'monospace' } as TextStyle,
	visitButton: { backgroundColor: Colors.primary, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, marginLeft: 'auto', marginRight: 10 } as ViewStyle,
	visitButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' } as TextStyle,
});

export default PublicOrgSearchSection;