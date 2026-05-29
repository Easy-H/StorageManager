import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../styles';

const OrgListItem = ({ org, onSelect }) => {
	const role = org.level >= 100 ? "admin" : "member";

	return (
		<View 
			onClick={() => onSelect(org)} 
			style={localStyles.orgCard}
		>
			<View style={localStyles.infoSection}>
				<Text style={localStyles.orgName}>{org.name}</Text>
				<Text style={localStyles.roleTag}>{role}</Text>
			</View>
			<Text style={localStyles.orgId}>
				ID: {org.id}
			</Text>
		</View>
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
		borderStyle: 'solid',
		borderRadius: 10,
		marginBottom: 10,
		backgroundColor: Colors.bgLight,
		cursor: 'pointer', // Web 환경 대응
	},
	infoSection: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
	orgName: {
		fontSize: 16,
		fontWeight: 'bolder',
		color: Colors.primary
	},
	roleTag: {
		color: '#888',
		fontSize: 10,
		backgroundColor: '#f0f0f0',
		paddingVertical: 2,
		paddingHorizontal: 6,
		borderRadius: 4
	},
	orgId: {
		fontSize: 11,
		color: '#aaa',
		fontFamily: 'monospace'
	}
});

export default OrgListItem;