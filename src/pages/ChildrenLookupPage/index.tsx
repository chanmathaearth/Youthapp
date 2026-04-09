import { useState } from "react";
import { useStudentById, useStudentByLineId, useMyChildrenByLineId } from "../../hooks/useStudent";
import ResultForParentPage from "../ResultForParentPage";
import { useLiff } from "../../hooks/useLiff";

export default function Page() {
    const [studentId, setStudentId] = useState<number | undefined>(undefined);
    const { lineUserId, isLiffReady, login, logout } = useLiff();
    const isDevelop = import.meta.env.VITE_APP_ENV === "develop";

    // Fetch child list if lineUserId is present
    const { data: myChildren, isLoading: isLoadingList } = useMyChildrenByLineId(lineUserId || null);

    const {
        data: dataJWT,
    } = useStudentById(!lineUserId ? studentId : undefined);
    const {
        data: dataLine,
    } = useStudentByLineId(lineUserId || null, studentId);

    const data = lineUserId ? dataLine : dataJWT;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Debug Label for checking mode */}
            {isDevelop && (
                <div className="bg-white p-2 text-xs text-center border-b flex flex-col items-center gap-1 shadow-sm">
                    <span className="text-gray-600 font-medium">
                        Mode: {lineUserId ? `LINE Bot (ID: ${lineUserId})` : "Regular JWT Access"}
                        {isLiffReady ? " ✅ LIFF Ready" : " ⏳ LIFF Initializing..."}
                    </span>
                    <div className="flex gap-2">
                        {!lineUserId && isLiffReady && (
                            <button 
                                onClick={() => login()}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full transition-colors font-medium shadow-sm"
                            >
                                Test Login
                            </button>
                        )}
                        {lineUserId && (
                            <button 
                                onClick={() => {
                                    logout();
                                    window.location.reload();
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition-colors font-medium shadow-sm"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            )}

            {!studentId && (
                <div className="max-w-md mx-auto p-6">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">ข้อมูลพัฒนาการลูกรัก</h1>
                        <p className="text-gray-500 mt-2">เลือกรายชื่อเด็กเพื่อดูข้อมูลในระบบ</p>
                    </div>

                    {lineUserId ? (
                        <div className="space-y-4">
                            {isLoadingList ? (
                                <div className="flex justify-center p-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : (
                                <>
                                    {myChildren && myChildren.length > 0 ? (
                                        <div className="grid gap-4">
                                            {myChildren.map((child) => (
                                                <button
                                                    key={child.id}
                                                    onClick={() => setStudentId(child.id)}
                                                    className="w-full text-left p-4 bg-white rounded-2xl shadow-sm hover:shadow-md border border-transparent hover:border-primary/20 transition-all flex items-center justify-between group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                                            {child.first_name[0]}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                                                                {child.first_name} {child.last_name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 flex items-center gap-2">
                                                                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-mono font-bold">
                                                                    รหัส: {child.child_id}
                                                                </span>
                                                                {child.nickname && (
                                                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">
                                                                        ชื่อเล่น: {child.nickname}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-gray-400 group-hover:translate-x-1 transition-transform">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-white p-8 rounded-2xl text-center shadow-sm border">
                                            <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-800 font-semibold">ไม่พบรายชื่อเด็กที่ผูกกับบัญชีนี้</p>
                                            <p className="text-gray-500 text-sm mt-1 leading-relaxed">กรุณาติดต่อเจ้าหน้าที่เพื่อทำการเชื่อมต่อข้อมูลเด็กกับ LINE ของคุณ</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-2xl text-center shadow-sm border">
                            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <p className="text-gray-800 font-semibold">การเข้าถึงถูกจำกัด</p>
                            <p className="text-gray-500 text-sm mt-1">กรุณาเข้าใช้งานผ่าน LINE Bot ของโครงการเท่านั้น</p>
                        </div>
                    )}
                </div>
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

