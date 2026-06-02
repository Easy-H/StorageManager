import React, { FC } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { GreenButton, BlueButton } from '../../../common/components/ui/react-native/custom';
import { User } from 'firebase/auth';

interface OrgActionButtonsProps {
  user: User | null;
  orgCreate: (name: string) => void;
  orgJoin: (id: string) => void;
  notice: (msg: string) => void;
}

const OrgActionButtons: FC<OrgActionButtonsProps> = ({ user, orgCreate, orgJoin, notice }) => {
  if (!user) return null;

  return (
    <View style={styles.buttons}>
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
  );
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
    marginTop: 10,
    marginBottom: 20
  },
});

export default OrgActionButtons;