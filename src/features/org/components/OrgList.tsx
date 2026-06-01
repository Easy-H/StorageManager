import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useOrgList } from '../hooks/useOrgList';
import { OrgMembership } from '../types';
import OrgListItem from './OrgListItem';

type User = {
    uid: string;
}

type OrgListProps = {
    user: User | null;
    navigate: (path: string) => void;
    setCurrentOrg: (org: OrgMembership) => void;
    onLoading: (isLoading: boolean) => void;
    notice: (msg: string) => void;
}

const OrgList = ({ user, navigate, setCurrentOrg, onLoading, notice }: OrgListProps) => {
    const {
        orgs,
        internalLoading,
        handleSelectOrg
    } = useOrgList(user, onLoading, notice, setCurrentOrg, navigate);

    return (
        <View style={localStyles.orgList}>
            {internalLoading ? (
                <Text style={{ color: '#999', marginVertical: 20, textAlign: 'center' }}>조직 목록을 불러오는 중...</Text>
            ) : (
                orgs && orgs.length > 0 ? ( // orgs가 null이 아닌 경우에만 length 속성에 접근
                    orgs.map(o => (
                        <OrgListItem key={o.id} org={o} onSelect={handleSelectOrg} />
                    ))
                ) : (
                    <Text style={{ color: '#999', marginVertical: 20, textAlign: 'center' }}>소속된 조직이 없습니다.</Text>
                )
            )}
        </View>
    )
}

export const localStyles = StyleSheet.create({
    orgList: {
        width: '100%',
        gap: 12,
    } as ViewStyle,
});

export default OrgList;