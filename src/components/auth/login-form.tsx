import {
  loginSchema,
  type LoginFormValues,
} from "@/validation/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaKeyboard } from "react-icons/fa";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import { axiosPublic } from "@/services/axios";
import toast from "react-hot-toast";
import logoImage from "@/assets/logo.jpg";

function LoginForm() {
  const [layoutName, setLayoutName] = useState("default");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [inputValues, setInputValues] = useState({
    symbolNo: "",
    password: "",
  });
  const [initialInstituteData, setInitialInstituteData] = useState({
    session_id: null,
    start_time: null,
    status: null,
    program_id: null,
    program_name: null,
    institute_name: null,
    institute_logo: null,
    isValidated: false,
    isLoadingInstitute: true,
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

  useEffect(() => {
    const getIntialInfo = async () => {
      try {
        const res = await axiosPublic.get("/initial/info");
        const data = await res.data;

        console.log(res);
        if (!data) throw new Error("No data was found");

        setInitialInstituteData((prev) => ({
          ...prev,
          ...data,
          isValidated: true,
        }));

        sessionStorage.setItem("institute-data", JSON.stringify(data));
      } catch (error: any) {
        setInitialInstituteData((prev) => ({ ...prev, isValidated: false }));
        toast.error(
          "No exams are currently being conducted. Please check back later!"
        );
      } finally {
        setInitialInstituteData((prev) => ({
          ...prev,
          isLoadingInstitute: false,
        }));
      }
    };

    getIntialInfo();
  }, []);

  if (initialInstituteData.isLoadingInstitute) {
    return (
      <div className="grid place-items-center min-h-screen">
        <h3 className="">Loading...</h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full bg-white p-8 rounded-xl border border-gray-200 shadow-md space-y-6"
      >
        <div className="flex items-center justify-center gap-2">
          <img
            src={
              initialInstituteData.institute_logo
                ? initialInstituteData.institute_logo
                : logoImage
            }
            width={400}
            height={400}
            alt={`logo for ${initialInstituteData.institute_name}`}
            className={`w-16 h-16 rounded-full border border-neutral-600/20 overflow-hidden`}
          />
          <p className="font-semibold">{initialInstituteData.institute_name}</p>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="font-bold text-2xl text-neutral-800">Login</h1>

          <div className="button-level flex justify-between items-center">
            <button
              type="button"
              onClick={() => setShowKeyboard(!showKeyboard)}
              disabled={isLoading || !initialInstituteData.isValidated}
              className="bg-gray-200 text-gray-700 text-xs p-2 rounded mt-2 disabled:cursor-not-allowed"
            >
              {showKeyboard ? <FaKeyboard /> : <FaKeyboard color="red" />}
            </button>
          </div>
        </div>

        <div className="">
          <label
            className="text-xs md:text-sm text-neutral-600 font-semibold mb-2"
            htmlFor="symbolNo"
          >
            Symbol No.
          </label>
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
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition disabled:cursor-not-allowed"
            disabled={!initialInstituteData.isValidated}
          />
          {errors.symbolNo && (
            <p className="text-sm text-red-500 mt-1">
              {errors.symbolNo.message}
            </p>
          )}
        </div>

        <div className="">
          <label
            className="text-xs md:text-sm text-neutral-600 font-semibold"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Enter your password"
            value={inputValues.password}
            onFocus={() => setInputName("password")}
            onChange={(e) => {
              const value = e.target.value;
              setInputValues({ ...inputValues, password: value });
              setValue("password", value);
            }}
            className="w-full mt-1 px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition disabled:cursor-not-allowed"
            disabled={!initialInstituteData.isValidated}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !initialInstituteData.isValidated}
          className={`w-full mt-2 py-2 px-4 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition disabled:bg-orange-300 disabled:cursor-not-allowed ${
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
