import React, { useState } from 'react';
import { View, Text, TextStyle, ViewStyle } from 'react-native';
import { useAuth } from '../features/auth/hooks/useAuth';
import { styles } from '../styles';
import { H2 } from '../common/components/ui/react-native/common';
import { LinkButton, GreenButton } from '../common/components/ui/react-native/custom';

interface AuthPageProps {
	notice: (msg: string) => void;
}

const AuthPage = ({ notice }: AuthPageProps) => {
	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [agreed, setAgreed] = useState(false);

	const { signUp, signIn } = useAuth();

	const handleSubmit = async (e?: any) => {
		if (e?.preventDefault) e.preventDefault();
		if (isSignUp && !agreed) return notice("약관에 동의해주세요.");
		try {
			if (isSignUp)
				await signUp(email, password)
			else await signIn(email, password)
		} catch (err) {
			if (err instanceof Error) {
				notice(err.message);
			} else {
				notice("알 수 없는 오류가 발생했습니다.");
			}
			console.log(err);
		}
	};

	return (
		<View style={styles.orgContainer}>
			<View style={styles.appHeader}>
				<H2>🛒 Storage Manager</H2>
			</View>
			{/* @ts-ignore - Web form tag */}
			<form className="form-stack"> 
				<Text style={{ textAlign: "left" } as TextStyle}>이메일</Text>
				{/* @ts-ignore - Web input tag */}
				<input type="email" placeholder="이메일" required onChange={(e: any) => setEmail(e.target.value)} className="input-basic" />
				<Text style={{ textAlign: "left" } as TextStyle}>비밀번호</Text>
				{/* @ts-ignore - Web input tag */}
				<input type="password" placeholder="비밀번호" required onChange={(e: any) => setPassword(e.target.value)} className="input-basic" />
				{isSignUp && (
					<View style={{ flexDirection: 'row' } as ViewStyle}
					>
						{/* @ts-ignore - Web checkbox */}
						<input type="checkbox" id="ag" onChange={(e: any) => setAgreed(e.target.checked)} />
						<Text style={{ fontSize: 12, marginLeft: 5 } as TextStyle}> 이용약관 동의</Text>
					</View>
				)}
				<GreenButton onPress={handleSubmit}>
					{isSignUp ? "가입하기" : "로그인"}
				</GreenButton>
			</form>
			<LinkButton onPress={() => setIsSignUp(!isSignUp)}>
				{isSignUp ? "로그인으로 이동" : "회원가입 하기"}
			</LinkButton>
		</View>
	);
};

export default AuthPage;