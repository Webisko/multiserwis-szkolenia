import React from "react";
import type { Course, Order, Student, StudentUser } from "../../types";
import { FinanceCenter } from "../finance/FinanceCenter";

export const AdminFinance: React.FC<{
  courses: Course[];
  students: Student[];
  orders?: Order[];
  users?: StudentUser[];
}> = ({ courses, students, orders, users }) => {
  return (
    <FinanceCenter
      role="admin"
      courses={courses}
      students={students}
      orders={orders}
      users={users}
    />
  );
};
