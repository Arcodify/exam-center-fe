import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/validation/auth.validation";

function RegisterForm({ isSubmitting = false }: { isSubmitting?: boolean }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-xl bg-white p-8 rounded-xl border border-gray-200 shadow-md space-y-6"
    >
      <h1 className="font-bold text-xl text-center text-neutral-900">
        Let's improve your knowledge
      </h1>

      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-neutral-700"
        >
          Name
        </label>
        <input
          type="text"
          {...register("name")}
          placeholder="Enter your name"
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-neutral-700"
        >
          Email
        </label>
        <input
          type="email"
          {...register("email")}
          placeholder="Enter your email"
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-neutral-700"
        >
          Password
        </label>
        <input
          type="password"
          {...register("password")}
          placeholder="Enter your password"
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPw"
          className="block text-sm font-medium text-neutral-700"
        >
          Confirm Password
        </label>
        <input
          type="password"
          {...register("confirmPw")}
          placeholder="Confirm your password"
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
        />
        {errors.confirmPw && (
          <p className="text-sm text-red-500 mt-1">
            {errors.confirmPw.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full mt-2 py-2 px-4 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition ${
          isSubmitting && "opacity-60 cursor-not-allowed"
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">Loading...</div>
        ) : (
          "Sign Up"
        )}
      </button>

      <p className="text-sm text-center text-gray-600 mt-4">
        Already have an account?
        <Link
          to="/login"
          className="ml-1 text-orange-600 hover:underline font-medium"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
