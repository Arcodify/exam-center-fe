import { useAuth } from "@/context/AuthContext";

const UserInfo = () => {
  const { user } = useAuth();

  const userInfo = {
    name: user?.name || "Not available",
    symbolNumber: user?.symbol_number,
    photo:
      user?.photo ||
      "https://t4.ftcdn.net/jpg/02/24/86/95/360_F_224869519_aRaeLneqALfPNBzg0xxMZXghtvBXkfIA.jpg",
  };

  return (
    <div className="bg-white/80 rounded-xl border border-white/30 p-5 w-full mx-auto">
      <div className="flex flex-col sm:flex-row lg:flex-col items-start">
        {/* Photo */}
        <img
          src={userInfo.photo}
          alt="Student"
          className="w-40 h-32 rounded-xl object-cover border-2 mx-auto border-white shadow-md mb-6"
        />

        <p className="text-slate-600 mb-2">
          <span className="font-medium">Name: </span>
          <span className="">{userInfo.name}</span>
        </p>
        <p className="text-slate-600">
          <span className="font-medium">Symbol No: </span>
          <span className="">{userInfo.symbolNumber}</span>
        </p>

        {/* Info */}
        {/* <div className="flex flex-col gap-3 w-full">
          <div className="flex justify-between bg-white px-4 py-2 rounded-lg shadow-sm text-gray-700">
            <span className="font-medium">Name</span>
            <span className="font-semibold">{userInfo.name}</span>
          </div>
          <div className="flex justify-between bg-white px-4 py-2 rounded-lg shadow-sm text-gray-700">
            <span className="font-medium">Symbol No.</span>
            <span className="font-semibold">{userInfo.symbolNumber}</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default UserInfo;
