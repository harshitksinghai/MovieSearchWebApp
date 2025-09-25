import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import OAuth from "../components/OAuth";
import VerifyEmail from "../components/VerifyEmail";
import { AuthMode, Mode, OtpMode } from "../utils/authTypes";
import LoginPassword from "../components/LoginPassword";
import ResetPassword from "../components/ResetPassword";
import Otp from "../components/Otp";
import Register from "../components/Register";
import { toast } from "sonner";
import { t } from "i18next";

type AuthPageProps = {
    mode: Mode;
}
const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
    const [currentMode, setCurrentMode] = useState<string>(mode);
    const [email, setEmail] = useState<string>('');
    const [authMode, setAuthMode] = useState<AuthMode>('verify-email');
    const [otpMode, setOtpMode] = useState<OtpMode>();
    const [error, setError] = useState<string>('');

    useEffect(() => {
        toast.error(error);
    }, [error])

    useEffect(() => {
        toast.info(currentMode === 'login' ? t('auth.userExistsMessage') : t('auth.userNotExistMessage'));
    }, [currentMode])

    const renderContent = () => {
        switch (authMode) {
            case "verify-email":
                return <>
                    <VerifyEmail
                        email={email}
                        setEmail={setEmail}
                        setAuthMode={setAuthMode}
                        setOtpMode={setOtpMode}
                        setError={setError}
                        setCurrentMode={setCurrentMode}
                    />
                </>
            case "otp":
                return <>
                    <Otp 
                        email={email}
                        otpMode={otpMode}
                        setOtpMode={setOtpMode}
                        setAuthMode={setAuthMode}
                        setError={setError}
                    />
                </>
            case "login-password":
                return <>
                    <LoginPassword
                        email={email}
                        setAuthMode={setAuthMode}
                        setOtpMode={setOtpMode}
                        setError={setError}
                    />
                </>
            case "reset-password":
                return <>
                    <ResetPassword
                        email={email}
                        setError={setError}
                        setOtpMode={setOtpMode}
                        setAuthMode={setAuthMode}
                    />
                </>
            case "register":
                return <>
                    <Register
                        email={email}
                        setError={setError}
                        setOtpMode={setOtpMode}
                        setAuthMode={setAuthMode}
                    />
                </>
        }
    }
    return (
        <>
            <Typography>
                {currentMode === 'login' ? t('auth.loginToApp') : t('auth.registerToApp')}
            </Typography>
            <OAuth />
            <Typography>OR</Typography>
            {renderContent()}
        </>
    )
}
export default AuthPage;