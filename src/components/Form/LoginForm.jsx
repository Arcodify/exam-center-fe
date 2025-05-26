import { useState } from "react";
import { Link, Form } from "react-router-dom";
import spinner from "../../assets/spinner.svg";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { FaKeyboard } from "react-icons/fa";

function LoginForm({ loading }) {
  const [layoutName, setLayoutName] = useState("default");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [inputValues, setInputValues] = useState({ email: "", password: "" });
  const [inputName, setInputName] = useState("email");

  const handleChange = (input) => {
    setInputValues((prev) => ({ ...prev, [inputName]: input }));
  };

  const onKeyPress = (button) => {
    if (button === "{shift}" || button === "{lock}") handleShift();
  };

  const handleShift = () => {
    setLayoutName((prevLayout) =>
      prevLayout === "default" ? "shift" : "default"
    );
  };
  return (
    <>
      <Form
        className="flex flex-col max-w-[420px] mx-auto"
        action="/login"
        method="post"
      >
        <h1 className="font-bold text-lg text-center text-neutral-800 mb-5">
          Login
        </h1>
        <div className="button-lev">
          <label
            className="text-xs md:text-sm text-neutral-600 font-semibold mb-2"
            htmlFor="email"
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
          name="email"
          placeholder="Enter your Symbol No."
          value={inputValues.email}
          onFocus={() => setInputName("email")}
          onChange={(e) =>
            setInputValues({ ...inputValues, email: e.target.value })
          }
          className="bg-neutral-50 ring-[1px] ring-gray-200 rounded-lg p-2 md:p-3 placeholder:text-gray-300 text-xs md:text-sm focus:border-none placeholder:text-xs md:placeholder:text-sm focus:outline-none focus:ring-[1px] focus:ring-orange-500/80"
        />
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
          name="password"
          placeholder="Enter your password"
          value={inputValues.password}
          onFocus={() => setInputName("password")}
          onChange={(e) =>
            setInputValues({ ...inputValues, password: e.target.value })
          }
          className="bg-neutral-50 ring-[1px] ring-gray-200 rounded-lg p-2 md:p-3 placeholder:text-gray-300 text-xs md:text-sm focus:border-none placeholder:text-xs md:placeholder:text-sm focus:outline-none focus:ring-[1px] focus:ring-orange-500/80"
        />
        <br />
        <button
          disabled={loading}
          className={`flex rounded-full ${
            !loading
              ? "bg-orange-500 hover:bg-neutral-50 hover:text-orange-500 "
              : "bg-orange-500/70 hover:border-red-100 cursor-not-allowed"
          }  p-1 justify-center font-semibold md:font-bold text-base md:text-lg text-center  mb-3 transition text-white`}
          type="submit"
        >
          {loading ? (
            <div className="flex items-center">
              <img
                src={spinner}
                alt="spinner"
                className="w-6 h-6 object-contain mr-2 animate-spin"
              />
              <p className="text-neutral-50/80 text-sm font-normal">
                Loading...
              </p>
            </div>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </Form>
      {showKeyboard && (
        <Keyboard
          // keyboardRef={{r => (this.keyboard = r)}}
          layoutName={layoutName}
          onChange={handleChange}
          inputName={inputName}
          onKeyPress={onKeyPress}
        />
      )}
    </>
  );
}

export default LoginForm;
