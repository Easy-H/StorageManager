import React, { FC } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { User } from 'firebase/auth';
import { Button } from '../../../common/components/ui/react-native/common';
import { vars } from '../../../common/components/ui';

interface OrgUserFooterProps {
  user: User | null;
  onLogout: () => void;
}

const OrgUserFooter: FC<OrgUserFooterProps> = ({ user, onLogout }) => {
  if (!user) return null;

  return (
    <View style={styles.profileHeader}>
      <View>
        <Text style={styles.authLabel}>로그인 계정</Text>
        <Text style={styles.authEMail}>{user?.email}</Text>
      </View>

      <Button onPress={onLogout} style={styles.logout}>
        로그아웃
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: vars.surface,
    width: "100%",
  } as ViewStyle,
  logout: {
    // @ts-ignore
    color: vars.errorRed,
    fontSize: 13,
    backgroundColor: 'transparent',
  } as ViewStyle & TextStyle,
  authLabel: {
    fontSize: 12,
    color: '#888'
  },
  authEMail: {
    color: vars.text,
    fontSize: 14,
    fontWeight: '600'
  },
});

export default OrgUserFooter;