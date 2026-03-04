"use client";

import { useState } from "react";
import { StudentSearch } from "../../components/StudentSearch";
import { useStudentById } from "../../hooks/useStudent";
import ResultForParentPage from "../ResultForParentPage";

export default function Page() {
  const [studentId, setStudentId] = useState<number | undefined>(undefined);

  const { data, isLoading, error } = useStudentById(studentId);

  const handleSearch = (id: string) => {
    setStudentId(Number(id));
  };

  return (
    <div>
      {!data && (
        <StudentSearch
          onSearch={handleSearch}
          isLoading={isLoading}
          error={
            error
              ? "ไม่พบข้อมูลนักเรียนรหัสนี้ กรุณาตรวจสอบเลขประจำตัวอีกครั้ง"
              : null
          }
        />
      )}

      {data && studentId && <ResultForParentPage childId={studentId} onBack={() => setStudentId(undefined)}
 />}
    </div>
  );
}
