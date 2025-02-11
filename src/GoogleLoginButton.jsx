import React, { useState } from "react";

const GoogleLoginButton = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/auth/google");
      const data = await response.json();

      if (data.url) {
        const popup = window.open(data.url, "Google Login", "width=500,height=600");
        const messageListener = (event) => {
          if (event.data.success) {
            console.log("User authenticated:", event.data.user);
            setIsAuthenticated(true); // Update state to reflect authentication
            popup.close(); // Close the popup automatically
          }
        };
        window.addEventListener("message", messageListener);
      } else {
        console.error("No URL returned from backend");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      style={{
        padding: "10px 20px",
        backgroundColor: "#4285F4",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      {isAuthenticated ? "Logged In" : "Google Log In"}
    </button>
  );
};

export default GoogleLoginButton;
