import LoginForm from "../../components/LoginForm";
import Background from "../../assets/background.png";
import LanguageSwitcher from "../../components/languageSwitcher";

const LoginPage = () => {
    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${Background})`, opacity: 0.3 }}
            />
            <div className="absolute inset-0 backdrop-blur-md z-0" />

            <div className="absolute top-4 right-4 z-20">
                <LanguageSwitcher />
            </div>

            <div className="relative z-10 flex items-center justify-center h-full w-full px-4">
                <div className="w-full max-w-md">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
