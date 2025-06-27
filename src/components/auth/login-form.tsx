import {
  loginSchema,
  type LoginFormValues,
} from "@/validation/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaKeyboard } from "react-icons/fa";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";

function LoginForm() {
  const [layoutName, setLayoutName] = useState("default");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [inputValues, setInputValues] = useState({
    symbolNo: "",
    password: "",
  });
  const [inputName, setInputName] = useState("symbolNo");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const handleChange = (input: string) => {
    setInputValues((prev) => ({ ...prev, [inputName]: input }));
    setValue(inputName as keyof LoginFormValues, input);
  };

  const onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") handleShift();
  };

  const handleShift = () => {
    setLayoutName((prevLayout) =>
      prevLayout === "default" ? "shift" : "default"
    );
  };

  const onSubmit = async (data: LoginFormValues) => {
    console.log("🚀 Login attempt with:", data.symbolNo);
    const success = await login({
      symbol_number: data.symbolNo,
      password: data.password,
    });

    if (success) {
      console.log("✅ Login successful, redirecting to dashboard...");
      navigate("/");
    } else {
      console.log("❌ Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full bg-white p-8 rounded-xl border border-gray-200 shadow-md space-y-6"
      >
        <h1 className="font-bold text-lg text-center text-neutral-800 mb-5">
          Login
        </h1>

        <div className="button-level flex justify-between items-center">
          <label
            className="text-xs md:text-sm text-neutral-600 font-semibold mb-2"
            htmlFor="symbolNo"
          >
            Symbol No.
          </label>
          <button
            type="button"
            onClick={() => setShowKeyboard(!showKeyboard)}
            className="bg-gray-200 text-gray-700 text-xs p-2 rounded mt-2"
          >
            {showKeyboard ? <FaKeyboard /> : <FaKeyboard color="red" />}
          </button>
        </div>
        <input
          type="text"
          autoComplete="off"
          {...register("symbolNo")}
          placeholder="Enter your Symbol No."
          value={inputValues.symbolNo}
          onFocus={() => setInputName("symbolNo")}
          onChange={(e) => {
            const value = e.target.value;
            setInputValues({ ...inputValues, symbolNo: value });
            setValue("symbolNo", value);
          }}
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
        />
        {errors.symbolNo && (
          <p className="text-sm text-red-500 mt-1">{errors.symbolNo.message}</p>
        )}

        <br />
        <div className="flex justify-between items-center mb-2">
          <label
            className="text-xs md:text-sm text-neutral-600 font-semibold"
            htmlFor="password"
          >
            Password
          </label>
        </div>
        <input
          type="password"
          {...register("password")}
          placeholder="Enter your password"
          value={inputValues.password}
          onFocus={() => setInputName("password")}
          onChange={(e) => {
            const value = e.target.value;
            setInputValues({ ...inputValues, password: value });
            setValue("password", value);
          }}
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}

        <br />
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full mt-2 py-2 px-4 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition ${
            isLoading && "opacity-60 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">Loading...</div>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {showKeyboard && (
        <div className="mt-4 w-full">
          <Keyboard
            layoutName={layoutName}
            onChange={handleChange}
            inputName={inputName}
            onKeyPress={onKeyPress}
          />
        </div>
      )}
    </div>
  );
}

export default LoginForm;
