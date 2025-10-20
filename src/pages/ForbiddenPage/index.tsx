// src/pages/ForbiddenPage.tsx
export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
      <p className="text-xl text-gray-700">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
    </div>
  );
}
