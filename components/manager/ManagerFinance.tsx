import React from "react";
import type { Course, Order, Student, StudentUser } from "../../types";
import { FinanceCenter } from "../finance/FinanceCenter";

interface ManagerFinanceProps {
  courses: Course[];
  students: Student[];
  orders?: Order[];
  users?: StudentUser[];
}

export const ManagerFinance: React.FC<ManagerFinanceProps> = ({
  courses,
  students,
  orders,
  users,
}) => {
  return (
    <FinanceCenter
      role="manager"
      courses={courses}
      students={students}
      orders={orders}
      users={users}
    />
  );
};
