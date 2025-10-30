import React from "react";
import StudentDashboard from "../_components/StudentDashBoard";
import MainLayout from "@/components/layout/MainLayout";

type Props = {};

const Page = (props: Props) => {
  return (
    <MainLayout>
      <StudentDashboard />
    </MainLayout>
  );
};

export default Page;
