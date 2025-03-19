import React, { useState } from "react";
import "./GoogleLoginButton.css";

const GoogleLoginButton = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(""); // Clear any previous errors
    setSuccessMessage(""); // Clear any previous success message
    try {
      const response = await fetch(process.env.REACT_APP_GOOGLE_LOGIN_URL);
      const data = await response.json();

      if (data.data.url) {
        const popup = window.open(data.data.url, "Google Login", "width=500,height=600");
        const messageListener = (event) => {
          if (event.data.success) {
            console.log("User authenticated:", event.data);
            setIsAuthenticated(true);
            setSuccessMessage("Successfully signed in!");
            popup.close();
          } else if (event.data.success === false) {
            popup.close();
            setError(event.data.message || "Authentication failed");
          }
          setIsLoading(false);
          window.removeEventListener("message", messageListener);
          console.log(event.data);
        };
        window.addEventListener("message", messageListener);
      } else {
        console.error("No URL returned from backend");
        setError("Unable to initialize login. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      setError("Something went wrong. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="button-container">
      <div className="login-wrapper">
        <button
          onClick={handleGoogleLogin}
          className={`google-btn ${isAuthenticated ? 'authenticated' : ''} ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {!isLoading && (
            <svg className="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          )}
          {isLoading ? (
            <div className="spinner"></div>
          ) : (
            <span className="button-text">
              {isAuthenticated ? "Signed in" : "Sign in with Google"}
            </span>
          )}
        </button>
        {successMessage && (
          <div className="success-message">
            <svg className="success-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            {successMessage}
          </div>
        )}
        {error && (
          <div className="error-message">
            <svg className="error-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleLoginButton;
