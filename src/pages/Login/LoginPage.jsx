import LoginForm from "../../components/Form/LoginForm";
import { useNavigate, useActionData, useNavigation } from "react-router-dom";
import AnimateProvider from "../../components/AnimateProvider/AnimateProvider";
import { useEffect } from "react";
import { handleLoginpro } from "../../api/auth";

function LoginPage() {
  const data = useActionData();  
  const navigate = useNavigate(); 
  const navigation = useNavigation();

  useEffect(() => {
    if (data?.type === "SUCCESS") {
      localStorage.setItem("user", JSON.stringify(data)); 
      localStorage.setItem("examTime", data.data.duration); // Save exam time
      navigate(`/question`);
    }
  }, [data, navigate]);

  return (
    <AnimateProvider>
      {data?.type === "ERROR" && (
        <p className="text-rose-700 text-xs font-bold mb-3">
          Error: {data.message || "An error occurred during login."}
        </p>
      )}
      <LoginForm loading={navigation.state === "submitting"} />
    </AnimateProvider>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email").trim();
  const password = formData.get("password").trim();

  if (!email || !password) {
    return {
      type: "ERROR",
      message: "Both credentials are required."
    };
  }

  try {
    const user = await handleLoginpro(email, password);

    return {
      type: "SUCCESS",
      data: user.data
    };
  } catch (error) {
    console.error("Login error:", error);

    let errorMessage = "An unknown error occurred.";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || "Invalid credentials.";
    } else if (error.request) {
      errorMessage = "No response from the server. Please try again later.";
    }

    return {
      type: "ERROR",
      message: errorMessage,
    };
  }
}

export default LoginPage;
