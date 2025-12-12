import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import { Phone } from "lucide-react";

export default function ContactPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-10 flex flex-col">

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            className="md:hidden p-2 bg-white shadow rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <h1 className="text-2xl md:text-3xl font-bold">Contact</h1>
        </div>

        {/* Centered Contact Box */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white shadow-xl rounded-3xl p-10 md:p-14 w-full max-w-2xl">

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <Phone size={40} />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-4">Support Contacts</h2>
            <p className="text-gray-600 text-center mb-8">
              If you need assistance, you may contact the following staff:
            </p>

            {/* Contact List */}
            <div className="space-y-6">

              {/* Contact 1 */}
              <div className="bg-gray-100 p-5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">John Doe</p>
                  <p className="text-sm text-gray-600">Maintenance Supervisor</p>
                </div>
                <p className="text-blue-600 text-lg font-bold">
                  +62 812-3456-7890
                </p>
              </div>

              {/* Contact 2 */}
              <div className="bg-gray-100 p-5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">Sarah Williams</p>
                  <p className="text-sm text-gray-600">Machine Operator</p>
                </div>
                <p className="text-blue-600 text-lg font-bold">
                  +62 811-9876-5432
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
