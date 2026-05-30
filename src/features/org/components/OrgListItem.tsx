import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../../styles';
import { OrgMembership, OrgRole } from '../types';

interface OrgListItemProps {
	org: OrgMembership;
	onSelect: (org: OrgMembership) => void;
}

const OrgListItem = ({ org, onSelect }: OrgListItemProps) => {
	const role = org.level >= OrgRole.ADMIN ? "admin" : "member";

	return (
		<TouchableOpacity 
			onPress={() => onSelect(org)} 
			style={localStyles.orgCard}
		>
			<View style={localStyles.infoSection}>
				<Text style={localStyles.orgName}>{org.name}</Text>
				<Text style={localStyles.roleTag}>{role}</Text>
			</View>
			<Text style={localStyles.orgId}>
				ID: {org.id}
			</Text>
		</TouchableOpacity>
	);
};

const localStyles = StyleSheet.create({
	orgCard: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 15,
		borderWidth: 1,
		borderColor: '#eee',
		borderRadius: 10,
		marginBottom: 10,
		backgroundColor: Colors.bgLight,
		// @ts-ignore
		cursor: 'pointer',
	} as ViewStyle,
	infoSection: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
	orgName: {
		fontSize: 16,
		fontWeight: 'bold',
		color: Colors.primary
	} as TextStyle,
	roleTag: {
		color: '#888',
		fontSize: 10,
		backgroundColor: '#f0f0f0',
		paddingVertical: 2,
		paddingHorizontal: 6,
		borderRadius: 4
	} as TextStyle,
	orgId: {
		fontSize: 11,
		color: '#aaa',
		// @ts-ignore
		fontFamily: 'monospace'
	} as TextStyle
});

export default OrgListItem;