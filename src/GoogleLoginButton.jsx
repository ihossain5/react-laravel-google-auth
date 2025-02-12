import React, { useState } from "react";

const GoogleLoginButton = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true); // Start loading animation
    try {
      const response = await fetch(process.env.REACT_APP_GOOGLE_LOGIN_URL);
      const data = await response.json();

      if (data.data.url) {
        const popup = window.open(data.data.url, "Google Login", "width=500,height=600");
        const messageListener = (event) => {
          if (event.data.success) {
            console.log("User authenticated:", event.data.token);
            setIsAuthenticated(true); // Update state to reflect authentication
            popup.close(); // Close the popup automatically
          } else if (event.data.success === false) {
            popup.close();
            alert(event.data.message);
          }
          setIsLoading(false); // Stop loading animation
        };
        window.addEventListener("message", messageListener);
      } else {
        console.error("No URL returned from backend");
        setIsLoading(false); // Stop loading animation
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      setIsLoading(false); // Stop loading animation
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      style={{
        padding: "10px 20px",
        backgroundColor: isAuthenticated ? "green" : "#4285F4",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        isAuthenticated ? "Logged In" : "Google Log In"
      )}
    </button>
  );
};

export default GoogleLoginButton;
