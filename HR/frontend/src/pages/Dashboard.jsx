import DashboardLayout from "../components/layouts/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800">Welcome to Dashboard</h1>
      <p className="mt-4 text-gray-600">This is your dashboard content.</p>
    </DashboardLayout>
  );
}
