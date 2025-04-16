"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LogOut,
  Bell,
  Settings,
  User,
  Layout,
  Shield,
  Key,
  Activity,
  Search,
  ChevronDown,
} from "lucide-react";
import Cookies from "js-cookie";

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState("User");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    // Check if token exists, if not redirect to landing
    const token = Cookies.get("token");
    if (!token) {
      router.push("/");
    }

    // In a real app, you'd fetch user info here
    // This is just for demonstration
    setUsername("Alex Johnson");
  }, [router]);

  const handleLogout = () => {
    // Remove the token from cookies
    Cookies.remove("token");
    // Redirect to landing page
    router.push("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-900 via-indigo-800 to-blue-900 text-white hidden md:flex flex-col">
        <div className="p-6 flex items-center">
          <Key className="h-6 w-6 text-white mr-2" />
          <span className="font-bold text-xl">Loginfy</span>
        </div>

        <nav className="flex-1 px-4 py-6">
          <div className="space-y-1">
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                activeSection === "dashboard"
                  ? "bg-white/20 font-medium"
                  : "hover:bg-white/10"
              }`}
            >
              <Layout className="h-5 w-5 mr-3" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveSection("security")}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                activeSection === "security"
                  ? "bg-white/20 font-medium"
                  : "hover:bg-white/10"
              }`}
            >
              <Shield className="h-5 w-5 mr-3" />
              Security
            </button>

            <button
              onClick={() => setActiveSection("activity")}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                activeSection === "activity"
                  ? "bg-white/20 font-medium"
                  : "hover:bg-white/10"
              }`}
            >
              <Activity className="h-5 w-5 mr-3" />
              Activity Log
            </button>
          </div>
        </nav>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg flex items-center justify-center transition duration-200"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            {/* Mobile menu button */}
            <button className="md:hidden text-gray-500 hover:text-gray-700">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Search */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 flex-1 max-w-lg mx-4">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none focus:outline-none flex-1 text-sm"
              />
            </div>

            {/* Right side items */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              <button className="text-gray-500 hover:text-gray-700">
                <Settings className="h-5 w-5" />
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-sm focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    {username.charAt(0)}
                  </div>
                  <span className="ml-2 hidden md:block">{username}</span>
                  <ChevronDown className="ml-1 h-4 w-4 hidden md:block" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </a>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Welcome back, {username}!</h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Security Status Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg font-medium">Security Status</h2>
                      <p className="text-green-600 font-medium mt-1">
                        Protected
                      </p>
                    </div>
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Your account is secured with two-factor authentication.
                  </p>
                </div>

                {/* Recent Logins Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg font-medium">Recent Logins</h2>
                      <p className="text-gray-500 font-medium mt-1">
                        Last 24 hours
                      </p>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Activity className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="space-y-3 mt-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Chrome on macOS</span>
                      <span className="text-gray-500">Just now</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Firefox on Windows</span>
                      <span className="text-gray-500">Yesterday, 8:15 PM</span>
                    </div>
                  </div>
                </div>

                {/* Connected Apps Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg font-medium">Connected Apps</h2>
                      <p className="text-gray-500 font-medium mt-1">
                        3 applications
                      </p>
                    </div>
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Layout className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="space-y-3 mt-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Spotify</span>
                      <span className="text-green-600">Active</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>GitHub</span>
                      <span className="text-green-600">Active</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Slack</span>
                      <span className="text-green-600">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Profile updated</p>
                      <p className="text-sm text-gray-500 mt-1">
                        You changed your profile picture
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Today, 2:30 PM
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Key className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Password changed</p>
                      <p className="text-sm text-gray-500 mt-1">
                        You updated your password successfully
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Yesterday, 11:45 AM
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Layout className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">App connected</p>
                      <p className="text-sm text-gray-500 mt-1">
                        You connected Spotify to your account
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Apr 14, 9:20 AM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Security Settings</h1>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-medium mb-4">
                  Two-Factor Authentication
                </h2>
                <p className="text-gray-600 mb-4">
                  Add an extra layer of security to your account by enabling
                  two-factor authentication.
                </p>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium">
                      Status: <span className="text-green-600">Enabled</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Configured via Authenticator App
                    </p>
                  </div>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition">
                    Manage
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-medium mb-4">Password Settings</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Last changed 30 days ago
                      </p>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                      Update
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-medium">Recovery Options</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Email: a****@example.com
                      </p>
                    </div>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition">
                      Manage
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-medium mb-4">Session Management</h2>
                <p className="text-gray-600 mb-4">
                  Manage devices where you're currently logged in.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-medium">Chrome on macOS</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Current session • IP: 192.168.1.1
                      </p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Current
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-medium">Firefox on Windows</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Last active: Yesterday • IP: 192.168.1.2
                      </p>
                    </div>
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium transition">
                      Revoke
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "activity" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Activity Log</h1>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium">
                    Recent Account Activity
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    All login attempts and account changes
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Device
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          Login
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Chrome on macOS
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          New York, USA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Just now
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Successful
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          Password Change
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Chrome on macOS
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          New York, USA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Yesterday, 11:45 AM
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Successful
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          Login
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Firefox on Windows
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Boston, USA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Yesterday, 8:15 PM
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Successful
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          Login Attempt
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Unknown Device
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Moscow, Russia
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Apr 14, 3:22 AM
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Failed
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          App Connection
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Chrome on macOS
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          New York, USA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Apr 14, 9:20 AM
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Successful
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                      Previous
                    </button>
                    <div className="text-sm text-gray-500">Page 1 of 3</div>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
