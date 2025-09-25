import Button from "@mui/material/Button"


const OAuth = () => {
    const handleGoogleOAuth = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google'; // Redirect to your backend's Google OAuth endpoint
    };

    const handleGithubOAuth = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/github'; // Redirect to your backend's GitHub OAuth endpoint
    };

    return (
        <>
        <Button onClick={handleGoogleOAuth}>Continue with Google</Button>
        <Button onClick={handleGithubOAuth}>Continue with Github</Button>
        </>
    )
}
export default OAuth;