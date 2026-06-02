export type ThemeVars = {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    box: string;
    text: string;
    buttonText: string;
    errorRed: string;
    font: string;
}

export const lightTheme: ThemeVars = {
    primary: '#1890ff',
    secondary: '#52c41a',
    background: '#f9f9f9',
    surface: '#dddddd',
    box: '#f0f7ff',
    text: '#242424',
    buttonText: 'white',
    errorRed: '#ff4d4f',
    font: "'KBO-Dia-Gothic_medium', Arial, sans-serif",
};

export const darkTheme: ThemeVars = {
    primary: '#1890ff',
    secondary: '#52c41a',
    background: '#101010',
    surface: '#313131',
    box: '#212121',
    text: '#ddd',
    buttonText: 'white',
    errorRed: '#ff4d4f',
    font: "'KBO-Dia-Gothic_medium', Arial, sans-serif",
};

/**
 * 시스템(OS) 설정에 따른 테마 모드를 반환합니다.
 */
export const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
};

/**
 * 애플리케이션 전역에서 참조할 가변 변수 객체입니다.
 * Object.assign을 통해 참조 주소를 유지하며 값을 변경합니다.
 */
const initialMode = getSystemTheme();
export const vars: ThemeVars = { ...(initialMode === 'dark' ? darkTheme : lightTheme) };

/**
 * 테마 모드를 변경하는 함수입니다.
 */
export const setThemeMode = (mode: 'light' | 'dark') => {
    const target = mode === 'light' ? lightTheme : darkTheme;
    Object.assign(vars, target);
};

export default vars;