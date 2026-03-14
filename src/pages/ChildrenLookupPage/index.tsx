import { useState } from "react";
import { StudentSearch } from "../../components/StudentSearch";
import { useStudentById, useStudentByLineId } from "../../hooks/useStudent";
import ResultForParentPage from "../ResultForParentPage";
import { useLiff } from "../../hooks/useLiff";

export default function Page() {
    const [studentId, setStudentId] = useState<number | undefined>(undefined);
    const { lineUserId, isLiffReady, login, logout } = useLiff();
    const isDevelop = import.meta.env.VITE_APP_ENV === "develop";

    if (isDevelop) {
        console.log("LIFF Status:", { isLiffReady, lineUserId });
    }

    const {
        data: dataJWT,
        isLoading: isLoadingJWT,
        error: errorJWT,
    } = useStudentById(!lineUserId ? studentId : undefined);
    const {
        data: dataLine,
        isLoading: isLoadingLine,
        error: errorLine,
    } = useStudentByLineId(lineUserId || null, studentId);

    const data = lineUserId ? dataLine : dataJWT;
    const isLoading = lineUserId ? isLoadingLine : isLoadingJWT;
    const error = lineUserId ? errorLine : errorJWT;

    if (isDevelop) {
        console.log("Mode:", lineUserId ? "LINE (POST)" : "Regular (JWT)");
    }

    const handleSearch = (id: string) => {
        setStudentId(Number(id));
    };

    return (
        <div>
            {/* Debug Label for checking mode */}
            {isDevelop && (
                <div className="bg-gray-100 p-2 text-xs text-center border-b flex flex-col items-center gap-1">
                    <span>
                        Mode: {lineUserId ? `LINE Bot (ID: ${lineUserId})` : "Regular JWT Access"}
                        {isLiffReady ? " ✅ LIFF Ready" : " ⏳ LIFF Initializing..."}
                    </span>
                    {!lineUserId && isLiffReady && (
                        <button 
                            onClick={() => login()}
                            className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                            Login to LINE (Test)
                        </button>
                    )}
                    {lineUserId && (
                        <button 
                            onClick={() => {
                                logout();
                                window.location.reload();
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                            Logout from LINE
                        </button>
                    )}
                </div>
            )}
            {!data && (
                <StudentSearch
                    onSearch={handleSearch}
                    isLoading={isLoading}
                    error={
                        error
                            ? "ไม่พบข้อมูลนักเรียนรหัสนี้ หรือคุณไม่มีสิทธิ์เข้าถึงข้อมูลของเด็กคนนี้"
                            : null
                    }
                />
            )}

            {data && studentId && (
                <ResultForParentPage
                    childId={studentId}
                    onBack={() => setStudentId(undefined)}
                    lineUserId={lineUserId}
                />
            )}
        </div>
    );
}

