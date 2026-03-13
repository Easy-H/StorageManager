import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useAuth } from '../features/auth/hooks/useAuth';
import { styles } from '../styles';

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
    } catch (err) { notice(err.message);
      console.log(err);
    }
  };

  return (
    <View style={styles.orgContainer}>
      <View style={styles.appHeader}>
        <Text style={styles.h2}>🛒 Storage Manager</Text>
      </View>
      <form className="form-stack">
        <Text style={{ textAlign: "left" }}>이메일</Text>
        <input type="email" placeholder="이메일" required onChange={e => setEmail(e.target.value)} className="input-basic" />
        <Text style={{ textAlign: "left" }}>비밀번호</Text>
        <input type="password" placeholder="비밀번호" required onChange={e => setPassword(e.target.value)} className="input-basic" />
        {isSignUp && (
          <View style={{flexDirection:'row'}}
            className="checkbox-row">
            <input type="checkbox" id="ag" onChange={e => setAgreed(e.target.checked)} />
            <Text htmlFor="ag" style={{ fontSize: '12px', marginLeft: '5px' }}> 이용약관 동의</Text>
          </View>
        )}
        <TouchableOpacity onPress={handleSubmit}
          style={styles.greenButton}>
            <Text style={styles.buttonText}>
              {isSignUp ? "가입하기" : "로그인"}</Text>
        </TouchableOpacity>
      </form>
      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} className="link-button">
        <Text>{isSignUp ? "로그인으로 이동" : "회원가입 하기"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthPage;