import { useState } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import { H2, LinkButton, SecondaryButton } from '../../common/components/ui-brick';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { styles } from '../../styles';

type AuthPageProps = {
	notice: (msg: string) => void;
	onBack?: () => void;
}

const AuthPage = ({ notice, onBack }: AuthPageProps) => {
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
		<View style={localStyles.orgContainer}>
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
				<SecondaryButton onPress={handleSubmit}>
					{isSignUp ? "가입하기" : "로그인"}
				</SecondaryButton>
			</form>
			<LinkButton onPress={() => setIsSignUp(!isSignUp)}>
				{isSignUp ? "로그인으로 이동" : "회원가입 하기"}
			</LinkButton>
			{onBack && (
				<LinkButton onPress={onBack}>← 조직 검색으로 돌아가기</LinkButton>
			)}
		</View>
	);
};

const localStyles = StyleSheet.create({
	orgContainer: {
		width: '100%',
		maxWidth: 400,
		marginVertical: 50,
		alignSelf: 'center',
		padding: 20,
		alignItems: 'center',
	}
});

export default AuthPage;