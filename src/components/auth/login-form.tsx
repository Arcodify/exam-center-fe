import "react-simple-keyboard/build/css/index.css";

import { useAuth } from "@/context/AuthContext";
import { axiosPublic } from "@/services/axios";
import {
  loginSchema,
  type LoginFormValues,
} from "@/validation/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaKeyboard } from "react-icons/fa";
import { useNavigate } from "react-router";
import Keyboard from "react-simple-keyboard";

interface props {
  onEnglishInstructions: (data: string[]) => void;
  onNepaliInstructions: (data: string[]) => void;
}

function LoginForm({ onEnglishInstructions, onNepaliInstructions }: props) {
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
    const normalized = inputName === "password" ? input.toUpperCase() : input;
    setInputValues((prev) => ({ ...prev, [inputName]: normalized }));
    setValue(inputName as keyof LoginFormValues, normalized);
  };

  const onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") handleShift();
  };

  const handleShift = () => {
    setLayoutName((prevLayout) =>
      prevLayout === "default" ? "shift" : "default",
    );
  };

  const onSubmit = async (data: LoginFormValues) => {
    const success = await login({
      symbol_number: data.symbolNo,
      password: data.password,
    });

    if (success) {
      navigate("/");
    }
  };

  useEffect(() => {
    const getIntialInfo = async () => {
      try {
        const res = await axiosPublic.get("/initial/info");
        const data = await res.data;

        if (!data) throw new Error("No data was found");

        setInitialInstituteData((prev) => ({
          ...prev,
          ...data,
          isValidated: true,
        }));

        onEnglishInstructions(data.instructions_english);
        onNepaliInstructions(data.instructions_nepali);

        sessionStorage.setItem("institute-data", JSON.stringify(data));
      } catch {
        setInitialInstituteData((prev) => ({ ...prev, isValidated: false }));
        toast.error(
          "No exams are currently being conducted. Please check back later!",
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
    <div className="flex flex-col w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-bold text-2xl text-gray-800">Login</h1>

          <div className="button-level flex justify-between items-center">
            <button
              type="button"
              onClick={() => setShowKeyboard(!showKeyboard)}
              disabled={isLoading || !initialInstituteData.isValidated}
              className="bg-gray-200 text-gray-700 text-xs p-2 rounded mt-2 disabled:cursor-not-allowed hover:bg-gray-300 transition"
              title="Toggle Virtual Keyboard"
            >
              {showKeyboard ? <FaKeyboard /> : <FaKeyboard color="#555" />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label
            className="text-sm text-gray-600 font-medium block"
            htmlFor="symbolNo"
          >
            Symbol No.
          </label>
          <input
            type="text"
            autoComplete="off"
            {...register("symbolNo")}
            placeholder=""
            value={inputValues.symbolNo}
            onFocus={() => setInputName("symbolNo")}
            onChange={(e) => {
              const value = e.target.value;
              setInputValues({ ...inputValues, symbolNo: value });
              setValue("symbolNo", value);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:cursor-not-allowed bg-white"
            disabled={!initialInstituteData.isValidated}
          />
          {errors.symbolNo && (
            <p className="text-sm text-red-500 mt-1">
              {errors.symbolNo.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            className="text-sm text-gray-600 font-medium block"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder=""
              value={inputValues.password}
              onFocus={() => setInputName("password")}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                setInputValues({ ...inputValues, password: value });
                setValue("password", value);
              }}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:cursor-not-allowed bg-white uppercase"
              disabled={!initialInstituteData.isValidated}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 font-medium"
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
          className={`w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition transform hover:scale-[1.01] shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none ${
            isLoading && "opacity-70 cursor-wait"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Logging in...
            </div>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {showKeyboard && (
        <div className="mt-4 w-full bg-white p-2 rounded-lg shadow-lg border border-gray-100">
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
