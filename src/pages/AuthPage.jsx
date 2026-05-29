import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useAuth } from '../features/auth/hooks/useAuth';
import { styles } from '../styles';
import { H2 } from '../common/components/ui/react-native/common';
import { CloseButton, GreenButton } from '../common/components/ui/react-native/custom';

const AuthPage = ({ notice }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp && !agreed) return notice("약관에 동의해주세요.");
    try {
      if (isSignUp)
        await signUp(email, password)
      else await signIn(email, password)
    } catch (err) {
      notice(err.message);
      console.log(err);
    }
  };

  return (
    <View style={styles.orgContainer}>
      <View style={styles.appHeader}>
        <H2>🛒 Storage Manager</H2>
      </View>
      <form className="form-stack">
        <Text style={{ textAlign: "left" }}>이메일</Text>
        <input type="email" placeholder="이메일" required onChange={e => setEmail(e.target.value)} className="input-basic" />
        <Text style={{ textAlign: "left" }}>비밀번호</Text>
        <input type="password" placeholder="비밀번호" required onChange={e => setPassword(e.target.value)} className="input-basic" />
        {isSignUp && (
          <View style={{ flexDirection: 'row' }}
            className="checkbox-row">
            <input type="checkbox" id="ag" onChange={e => setAgreed(e.target.checked)} />
            <Text htmlFor="ag" style={{ fontSize: '12px', marginLeft: '5px' }}> 이용약관 동의</Text>
          </View>
        )}
        <GreenButton onPress={handleSubmit}>
          {isSignUp ? "가입하기" : "로그인"}
        </GreenButton>
      </form>
      <CloseButton onPress={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? "로그인으로 이동" : "회원가입 하기"}
      </CloseButton>
    </View>
  );
};

export default AuthPage;