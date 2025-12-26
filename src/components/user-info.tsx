import { useAuth } from "@/context/AuthContext";

const UserInfo = () => {
  const { user } = useAuth();

  const userInfo = {
    name: user?.name || "Not available",
    symbolNumber: user?.symbol_number,
    photo:
      user?.photo ||
      "https://t4.ftcdn.net/jpg/02/24/86/95/360_F_224869519_aRaeLneqALfPNBzg0xxMZXghtvBXkfIA.jpg",

    program: user?.program,
    subject: user?.subject,
    level: user?.level,
  };

  return (
    <div className="bg-white/80 rounded-xl border border-white/30 w-full mx-auto mt-1 mb-0.5 pl-1">
      <div className="flex gap-2 items-center">
        {/* Photo */}

        <div className="h-24 w-24">
          <img
            src={userInfo.photo}
            alt="Student"
            className="w-full h-full rounded-lg object-cover border-2 border-white"
          />
        </div>

        <div>
          <p className="text-slate-600">
            <span className="font-medium">Name: </span>
            <span className="font-bold">{userInfo.name}</span>
          </p>
          <p className="text-slate-600">
            <span className="font-medium">Symbol No: </span>
            <span className="">{userInfo.symbolNumber}</span>
          </p>
          {userInfo.subject && userInfo.subject.name && (
            <p className="text-slate-600">
              <span className="font-medium">Subject: </span>
              <span className="">{userInfo.subject.name}</span>
            </p>
          )}
          <p className="text-slate-600">
            <span className="font-medium">Program: </span>
            <span className="">{userInfo.program?.name}</span>
          </p>
          <p className="text-slate-600">
            <span className="font-medium">Level: </span>
            <span className="">{userInfo.level?.name}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
