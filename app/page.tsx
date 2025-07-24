"use client";

import { Roboto_Condensed, JetBrains_Mono } from "next/font/google";

const jetBrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Activity,
  TrendingUp,
  User,
  PlusCircle,
  Clock,
  MapPin,
  BarChart2,
  Award,
  AlertCircle,
  Heart,
  ChevronDown,
  Settings,
  LogOut,
  Flame,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

interface ActivityData {
  id: string;
  type: "running" | "cycling";
  date: string;
  duration: number;
  distance: number;
  calories: number;
  elevationGain?: number;
  avgSpeed: number;
  notes?: string;
}

interface UserStats {
  totalActivities: number;
  totalDistance: number;
  totalDuration: number;
  totalCalories: number;
  avgSpeed: number;
  weeklyProgress: {
    week: string;
    runningDistance: number;
    cyclingDistance: number;
  }[];
  activityDistribution: {
    name: string;
    value: number;
  }[];
}

interface FormErrors {
  [key: string]: string;
}

const initialActivities: ActivityData[] = [
  {
    id: "1",
    type: "running",
    date: "2025-03-18",
    duration: 45,
    distance: 7.5,
    calories: 450,
    avgSpeed: 10,
    notes: "Morning run in the park",
  },
  {
    id: "2",
    type: "cycling",
    date: "2025-03-20",
    duration: 90,
    distance: 30,
    calories: 520,
    elevationGain: 150,
    avgSpeed: 20,
    notes: "Weekend ride on mountain trails",
  },
  {
    id: "3",
    type: "running",
    date: "2025-03-22",
    duration: 30,
    distance: 5,
    calories: 320,
    avgSpeed: 10,
    notes: "Recovery run",
  },
  {
    id: "4",
    type: "cycling",
    date: "2025-03-23",
    duration: 120,
    distance: 40,
    calories: 680,
    elevationGain: 200,
    avgSpeed: 20,
    notes: "Long ride with cycling group",
  },
  {
    id: "5",
    type: "running",
    date: "2025-03-24",
    duration: 60,
    distance: 10,
    calories: 600,
    avgSpeed: 10,
    notes: "Tempo run",
  },
];

const weeklyProgressData = [
  { week: "Week 1", runningDistance: 15, cyclingDistance: 40 },
  { week: "Week 2", runningDistance: 20, cyclingDistance: 35 },
  { week: "Week 3", runningDistance: 22.5, cyclingDistance: 60 },
  { week: "Week 4", runningDistance: 25, cyclingDistance: 70 },
];

const activityDistributionData = [
  { name: "Running", value: 3 },
  { name: "Cycling", value: 2 },
];

const COLORS = {
  primary: "#FC4C02",
  primaryDark: "#E34402",
  primaryLight: "#FFF1EC",
  secondary: "#2D87C3",
  secondaryDark: "#1E5A86",
  secondaryLight: "#EBF5FC",
  running: "#FC4C02",
  cycling: "#2D87C3",
  darkGray: "#242428",
  mediumGray: "#5D5D5D",
  lightGray: "#F7F7FA",
  white: "#FFFFFF",
  success: "#27AE60",
  warning: "#F39C12",
  chart: {
    running: "#FC4C02",
    cycling: "#2D87C3",
    gradient1: "#FF8A65",
    gradient2: "#64B5F6",
  },
};

const FitnessTracker: React.FC = () => {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [newActivity, setNewActivity] = useState<Partial<ActivityData>>({
    type: "running",
    date: "",
    duration: 0,
    distance: 0,
    calories: 0,
    avgSpeed: 0,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isClient, setIsClient] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setActivities(initialActivities);
    setNewActivity((prev) => ({
      ...prev,
      date: new Date().toISOString().slice(0, 10),
    }));
  }, []);

  const calculateStats = (): UserStats => {
    const totalActivities = activities.length;
    const totalDistance = activities.reduce(
      (sum, act) => sum + act.distance,
      0
    );
    const totalDuration = activities.reduce(
      (sum, act) => sum + act.duration,
      0
    );
    const totalCalories = activities.reduce(
      (sum, act) => sum + act.calories,
      0
    );
    const avgSpeed = totalDistance / (totalDuration / 60) || 0;

    return {
      totalActivities,
      totalDistance,
      totalDuration,
      totalCalories,
      avgSpeed,
      weeklyProgress: weeklyProgressData,
      activityDistribution: activityDistributionData,
    };
  };

  const stats = calculateStats();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (
      [
        "duration",
        "distance",
        "calories",
        "elevationGain",
        "avgSpeed",
      ].includes(name)
    ) {
      const numValue = parseFloat(value);

      setNewActivity({
        ...newActivity,
        [name]: isNaN(numValue) ? 0 : numValue,
      });
    } else {
      setNewActivity({
        ...newActivity,
        [name]: value,
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!newActivity.type) {
      errors.type = "Activity type is required";
    }

    if (!newActivity.date) {
      errors.date = "Date is required";
    }

    if (!newActivity.duration || newActivity.duration <= 0) {
      errors.duration = "Duration must be greater than 0";
    }

    if (!newActivity.distance || newActivity.distance <= 0) {
      errors.distance = "Distance must be greater than 0";
    }

    if (!newActivity.calories || newActivity.calories <= 0) {
      errors.calories = "Calories must be greater than 0";
    }

    if (!newActivity.avgSpeed || newActivity.avgSpeed <= 0) {
      errors.avgSpeed = "Average speed must be greater than 0";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newActivityData: ActivityData = {
      id: Date.now().toString(),
      type: newActivity.type as "running" | "cycling",
      date: newActivity.date as string,
      duration: newActivity.duration as number,
      distance: newActivity.distance as number,
      calories: newActivity.calories as number,
      avgSpeed: newActivity.avgSpeed as number,
      elevationGain: newActivity.elevationGain,
      notes: newActivity.notes,
    };

    setActivities([...activities, newActivityData]);

    // Reset form
    setNewActivity({
      type: "running",
      date: new Date().toISOString().slice(0, 10),
      duration: 0,
      distance: 0,
      calories: 0,
      avgSpeed: 0,
    });

    setFormErrors({});

    setActiveTab("activities");
  };

  const calculatePace = (duration: number, distance: number): string => {
    if (duration <= 0 || distance <= 0) return "0:00";

    const paceInMinutes = duration / distance;
    const minutes = Math.floor(paceInMinutes);
    const seconds = Math.round((paceInMinutes - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-700">Loading FitTrack...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${robotoCondensed.className} min-h-screen flex flex-col bg-gray-50 text-gray-800`}
    >
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-md">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <h1 className="ml-2 text-2xl font-extrabold text-gray-800 tracking-tight">
                  FIT<span className="text-orange-500">TRACK</span>
                </h1>
              </div>
            </div>
            <div className="relative flex items-center space-x-4">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition-all bg-strava-orange cursor-pointer">
                <Heart className="h-5 w-5" />
              </button>
              <button
                className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg transition-all bg-strava-orange cursor-pointer"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <img
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="User Profile"
                  className="w-8 h-8 rounded-full border border-gray-200"
                />
                <ChevronDown className="h-4 w-4 text-gray-500 bg-strava-orange cursor-pointer" />
              </button>

              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-50">
                  <div className="flex items-center space-x-3 p-2">
                    <img
                      src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="User Profile"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-800">John Doe</p>
                      <p className="text-xs text-gray-500">Premium Member</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <button className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 flex items-center text-gray-700 bg-strava-orange cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <button className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 flex items-center text-gray-700 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}

              <button
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-all  cursor-pointer"
                onClick={() => setActiveTab("addActivity")}
              >
                <PlusCircle className="h-5 w-5 mr-1 inline-block" />
                Record
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto">
          <div className="flex overflow-x-auto">
            <button
              className={`px-6 py-4 font-medium transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-orange-500"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <div className="flex items-center space-x-2">
                <BarChart2
                  className={`h-5 w-5 ${activeTab === "dashboard" ? "text-orange-500" : "text-gray-500"}`}
                />
                <span>Dashboard</span>
              </div>
            </button>
            <button
              className={`px-6 py-4 font-medium transition-all cursor-pointer ${
                activeTab === "activities"
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-orange-500"
              }`}
              onClick={() => setActiveTab("activities")}
            >
              <div className="flex items-center space-x-2">
                <Calendar
                  className={`h-5 w-5 ${activeTab === "activities" ? "text-orange-500" : "text-gray-500"}`}
                />
                <span>Activities</span>
              </div>
            </button>
            <button
              className={`px-6 py-4 font-medium transition-all cursor-pointer ${
                activeTab === "addActivity"
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-orange-500"
              }`}
              onClick={() => setActiveTab("addActivity")}
            >
              <div className="flex items-center space-x-2">
                <PlusCircle
                  className={`h-5 w-5 ${activeTab === "addActivity" ? "text-orange-500" : "text-gray-500"}`}
                />
                <span>Add Activity</span>
              </div>
            </button>
            <button
              className={`px-6 py-4 font-medium transition-all cursor-pointer ${
                activeTab === "progress"
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-orange-500"
              }`}
              onClick={() => setActiveTab("progress")}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp
                  className={`h-5 w-5 ${activeTab === "progress" ? "text-orange-500" : "text-gray-500"}`}
                />
                <span>Progress</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 flex-1 max-w-6xl">
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl text-gray-800">Your Dashboard</h2>
              <div className="text-sm text-gray-500">
                Last updated: April 1, 2025
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-5 group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Total Activities
                    </p>
                    <p className="text-3xl text-gray-800">
                      {stats.totalActivities}
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full group-hover:bg-orange-500 transition-colors">
                    <Activity className="h-6 w-6 text-orange-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-5 group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Total Distance
                    </p>
                    <p className="text-3xl text-gray-800">
                      {stats.totalDistance.toFixed(1)}{" "}
                      <span className="text-lg font-normal text-gray-500">
                        km
                      </span>
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-500 transition-colors">
                    <MapPin className="h-6 w-6 text-blue-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-5 group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Total Duration
                    </p>
                    <p className="text-3xl text-gray-800">
                      {Math.floor(stats.totalDuration / 60)}
                      <span className="text-lg font-normal text-gray-500">
                        h
                      </span>{" "}
                      {stats.totalDuration % 60}
                      <span className="text-lg font-normal text-gray-500">
                        m
                      </span>
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-500 transition-colors">
                    <Clock className="h-6 w-6 text-purple-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-5 group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Total Calories
                    </p>
                    <p className="text-3xl text-gray-800">
                      {stats.totalCalories.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full group-hover:bg-red-500 transition-colors">
                    <Flame className="h-6 w-6 text-red-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-6 lg:col-span-1">
                <h3 className="text-lg text-gray-800 mb-4">Activity Types</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.activityDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        cornerRadius={6}
                        stroke="#FFFFFF"
                        strokeWidth={3}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        <Cell fill={COLORS.running} />
                        <Cell fill={COLORS.cycling} />
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          border: "none",
                          padding: "8px 12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center mt-4 space-x-8">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Running
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Cycling
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-6 lg:col-span-2">
                <h3 className="text-lg text-gray-800 mb-4">Weekly Distance</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={stats.weeklyProgress}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorRunning"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={COLORS.running}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor={COLORS.running}
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorCycling"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={COLORS.cycling}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor={COLORS.cycling}
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#eee"
                      />
                      <XAxis
                        dataKey="week"
                        tick={{ fill: "#888", fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: "#eee" }}
                      />
                      <YAxis
                        tick={{ fill: "#888", fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: "#eee" }}
                        label={{
                          value: "Distance (km)",
                          angle: -90,
                          position: "insideLeft",
                          fill: "#888",
                          fontSize: 12,
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          border: "none",
                        }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ paddingTop: 10 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="runningDistance"
                        name="Running"
                        stroke={COLORS.running}
                        fillOpacity={1}
                        fill="url(#colorRunning)"
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="cyclingDistance"
                        name="Cycling"
                        stroke={COLORS.cycling}
                        fillOpacity={1}
                        fill="url(#colorCycling)"
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg text-gray-800">Recent Activities</h3>
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-all bg-strava-orange cursor-pointer"
                  onClick={() => setActiveTab("activities")}
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto -mx-6">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-y border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Distance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Speed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {activities.slice(-3).map((activity) => (
                      <tr
                        key={activity.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {activity.type === "running" ? (
                              <div className="p-2 bg-orange-100 rounded-full mr-3">
                                <Activity className="h-4 w-4 text-orange-500" />
                              </div>
                            ) : (
                              <div className="p-2 bg-blue-100 rounded-full mr-3">
                                <TrendingUp className="h-4 w-4 text-blue-500" />
                              </div>
                            )}
                            <span className="capitalize font-medium text-gray-800">
                              {activity.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {new Date(activity.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                          {activity.distance.toFixed(1)} km
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {Math.floor(activity.duration / 60)}h{" "}
                          {activity.duration % 60}m
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                          {activity.avgSpeed.toFixed(1)} km/h
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activities" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl text-gray-800">Your Activities</h2>
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-all flex items-center  cursor-pointer"
                onClick={() => setActiveTab("addActivity")}
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                <span>Record Activity</span>
              </button>
            </div>

            {activities.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <Activity className="h-10 w-10 text-orange-500" />
                </div>
                <h3 className="text-xl  text-gray-800 mb-2">
                  No activities yet
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start tracking your fitness journey by recording your first
                  activity.
                </p>
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-md transition-all cursor-pointer"
                  onClick={() => setActiveTab("addActivity")}
                >
                  Record First Activity
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Activity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Distance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Calories
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avg Speed
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pace
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {activities.map((activity, index) => (
                        <tr
                          key={activity.id}
                          className={`hover:bg-gray-50 transition-colors cursor-pointer ${index % 2 === 0 ? "bg-gray-50/30" : ""}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {activity.type === "running" ? (
                                <div className="p-2 bg-orange-100 rounded-full mr-3">
                                  <Activity className="h-4 w-4 text-orange-500" />
                                </div>
                              ) : (
                                <div className="p-2 bg-blue-100 rounded-full mr-3">
                                  <TrendingUp className="h-4 w-4 text-blue-500" />
                                </div>
                              )}
                              <span className="capitalize font-medium text-gray-800">
                                {activity.type}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {new Date(activity.date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                            {activity.distance.toFixed(1)} km
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {Math.floor(activity.duration / 60)}h{" "}
                            {activity.duration % 60}m
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {activity.calories} kcal
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                            {activity.avgSpeed.toFixed(1)} km/h
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {calculatePace(
                              activity.duration,
                              activity.distance
                            )}{" "}
                            min/km
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap truncate max-w-xs text-gray-600">
                            {activity.notes || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "addActivity" && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl text-gray-800 mb-6">Record New Activity</h2>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Type
                    </label>
                    <div className="flex space-x-4">
                      <label
                        className={`flex-1 rounded-lg border p-4 cursor-pointer transition-all ${
                          newActivity.type === "running"
                            ? "border-orange-500 bg-orange-50 ring-2 ring-orange-100"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="type"
                          value="running"
                          checked={newActivity.type === "running"}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="flex items-center">
                          <Activity
                            className={`h-5 w-5 mr-2 ${
                              newActivity.type === "running"
                                ? "text-orange-500"
                                : "text-gray-400"
                            }`}
                          />
                          <span
                            className={`font-medium ${
                              newActivity.type === "running"
                                ? "text-orange-700"
                                : "text-gray-700"
                            }`}
                          >
                            Running
                          </span>
                        </div>
                      </label>
                      <label
                        className={`flex-1 rounded-lg border p-4 cursor-pointer transition-all ${
                          newActivity.type === "cycling"
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="type"
                          value="cycling"
                          checked={newActivity.type === "cycling"}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="flex items-center">
                          <TrendingUp
                            className={`h-5 w-5 mr-2 ${
                              newActivity.type === "cycling"
                                ? "text-blue-500"
                                : "text-gray-400"
                            }`}
                          />
                          <span
                            className={`font-medium ${
                              newActivity.type === "cycling"
                                ? "text-blue-700"
                                : "text-gray-700"
                            }`}
                          >
                            Cycling
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={newActivity.date}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border ${formErrors.date ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                      max={new Date().toISOString().split("T")[0]}
                    />
                    {formErrors.date && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.date}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label
                        htmlFor="duration"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Duration (min) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="duration"
                        name="duration"
                        min="1"
                        max="1440"
                        value={newActivity.duration || ""}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border ${formErrors.duration ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                      />
                      {formErrors.duration && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.duration}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="distance"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Distance (km) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="distance"
                        name="distance"
                        min="0.1"
                        max="1000"
                        step="0.1"
                        value={newActivity.distance || ""}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border ${formErrors.distance ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                      />
                      {formErrors.distance && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.distance}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="calories"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Calories <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="calories"
                        name="calories"
                        min="1"
                        max="10000"
                        value={newActivity.calories || ""}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border ${formErrors.calories ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                      />
                      {formErrors.calories && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.calories}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="avgSpeed"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Average Speed (km/h){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="avgSpeed"
                        name="avgSpeed"
                        min="0.1"
                        max={newActivity.type === "running" ? "40" : "100"}
                        step="0.1"
                        value={newActivity.avgSpeed || ""}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border ${formErrors.avgSpeed ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                      />
                      {newActivity.distance && newActivity.duration ? (
                        <p className="mt-1 text-xs text-gray-500">
                          Suggested speed:{" "}
                          {(
                            newActivity.distance /
                              (newActivity.duration / 60) || 0
                          ).toFixed(1)}{" "}
                          km/h
                        </p>
                      ) : null}
                      {formErrors.avgSpeed && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.avgSpeed}
                        </p>
                      )}
                    </div>
                    {newActivity.type === "cycling" && (
                      <div>
                        <label
                          htmlFor="elevationGain"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Elevation Gain (m)
                        </label>
                        <input
                          type="number"
                          id="elevationGain"
                          name="elevationGain"
                          min="0"
                          max="10000"
                          value={newActivity.elevationGain || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      maxLength={500}
                      value={newActivity.notes || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="How was your activity? Add any notes here..."
                    />
                    {newActivity.notes && (
                      <p className="mt-1 text-xs text-gray-500 text-right">
                        {newActivity.notes.length}/500 characters
                      </p>
                    )}
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-md transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        Object.keys(formErrors).length > 0 ||
                        !newActivity.date ||
                        !newActivity.duration ||
                        !newActivity.distance ||
                        !newActivity.calories ||
                        !newActivity.avgSpeed
                      }
                    >
                      Save Activity
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === "progress" && (
          <div className="space-y-8">
            <h2 className="text-2xl  text-gray-800">Your Progress</h2>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-6">
              <h3 className="text-lg text-gray-800 mb-4">
                Weekly Distance Breakdown
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={stats.weeklyProgress}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient
                        id="gradientRunning"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#FC4C02" stopOpacity={1} />
                        <stop
                          offset="100%"
                          stopColor="#FF8A65"
                          stopOpacity={1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="gradientCycling"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#2D87C3" stopOpacity={1} />
                        <stop
                          offset="100%"
                          stopColor="#64B5F6"
                          stopOpacity={1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="3 3"
                      stroke="#eee"
                    />
                    <XAxis
                      dataKey="week"
                      axisLine={{ stroke: "#e0e0e0" }}
                      tickLine={{ stroke: "#e0e0e0" }}
                      tick={{ fill: "#757575", fontWeight: 500, fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={{ stroke: "#e0e0e0" }}
                      tickLine={{ stroke: "#e0e0e0" }}
                      tick={{ fill: "#757575", fontWeight: 500, fontSize: 12 }}
                      label={{
                        value: "Distance (km)",
                        angle: -90,
                        position: "insideLeft",
                        fill: "#757575",
                        fontWeight: 500,
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        border: "none",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ paddingTop: "16px" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="runningDistance"
                      name="Running"
                      stroke="url(#gradientRunning)"
                      strokeWidth={3}
                      dot={{
                        r: 6,
                        fill: "#FC4C02",
                        strokeWidth: 2,
                        stroke: "#FFFFFF",
                      }}
                      activeDot={{
                        r: 8,
                        fill: "#FFFFFF",
                        stroke: "#FC4C02",
                        strokeWidth: 2,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="cyclingDistance"
                      name="Cycling"
                      stroke="url(#gradientCycling)"
                      strokeWidth={3}
                      dot={{
                        r: 6,
                        fill: "#2D87C3",
                        strokeWidth: 2,
                        stroke: "#FFFFFF",
                      }}
                      activeDot={{
                        r: 8,
                        fill: "#FFFFFF",
                        stroke: "#2D87C3",
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-orange-100 rounded-full mr-3">
                    <Activity className="h-5 w-5 text-orange-500" />
                  </div>
                  <h3 className="text-lg text-gray-800">Running Summary</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <span className="text-gray-600 font-medium">
                      Total Runs
                    </span>
                    <span className="font-semibold text-gray-800 bg-orange-100 px-3 py-1 rounded-full">
                      {activities.filter((a) => a.type === "running").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <span className="text-gray-600 font-medium">
                      Total Distance
                    </span>
                    <span className="font-semibold text-gray-800 bg-orange-100 px-3 py-1 rounded-full">
                      {activities
                        .filter((a) => a.type === "running")
                        .reduce((sum, act) => sum + act.distance, 0)
                        .toFixed(1)}{" "}
                      km
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <span className="text-gray-600 font-medium">
                      Average Pace
                    </span>
                    <span className="font-semibold text-gray-800 bg-orange-100 px-3 py-1 rounded-full">
                      {(() => {
                        const runActivities = activities.filter(
                          (a) => a.type === "running"
                        );
                        if (runActivities.length === 0) return "-";
                        const totalDuration = runActivities.reduce(
                          (sum, act) => sum + act.duration,
                          0
                        );
                        const totalDistance = runActivities.reduce(
                          (sum, act) => sum + act.distance,
                          0
                        );
                        return (
                          calculatePace(totalDuration, totalDistance) +
                          " min/km"
                        );
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Average Distance
                    </span>
                    <span className="font-semibold text-gray-800 bg-orange-100 px-3 py-1 rounded-full">
                      {(() => {
                        const runActivities = activities.filter(
                          (a) => a.type === "running"
                        );
                        if (runActivities.length === 0) return "-";
                        const totalDistance = runActivities.reduce(
                          (sum, act) => sum + act.distance,
                          0
                        );
                        return (
                          (totalDistance / runActivities.length).toFixed(1) +
                          " km"
                        );
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 rounded-full mr-3">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  <h3 className="text-lg text-gray-800">Cycling Summary</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <span className="text-gray-600 font-medium">
                      Total Rides
                    </span>
                    <span className="font-semibold text-gray-800 bg-blue-100 px-3 py-1 rounded-full">
                      {activities.filter((a) => a.type === "cycling").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <span className="text-gray-600 font-medium">
                      Total Distance
                    </span>
                    <span className="font-semibold text-gray-800 bg-blue-100 px-3 py-1 rounded-full">
                      {activities
                        .filter((a) => a.type === "cycling")
                        .reduce((sum, act) => sum + act.distance, 0)
                        .toFixed(1)}{" "}
                      km
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <span className="text-gray-600 font-medium">
                      Average Speed
                    </span>
                    <span className="font-semibold text-gray-800 bg-blue-100 px-3 py-1 rounded-full">
                      {(() => {
                        const cyclingActivities = activities.filter(
                          (a) => a.type === "cycling"
                        );
                        if (cyclingActivities.length === 0) return "-";
                        const totalDistance = cyclingActivities.reduce(
                          (sum, act) => sum + act.distance,
                          0
                        );
                        const totalDuration =
                          cyclingActivities.reduce(
                            (sum, act) => sum + act.duration,
                            0
                          ) / 60;
                        return (
                          (totalDistance / totalDuration).toFixed(1) + " km/h"
                        );
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Average Distance
                    </span>
                    <span className="font-semibold text-gray-800 bg-blue-100 px-3 py-1 rounded-full">
                      {(() => {
                        const cyclingActivities = activities.filter(
                          (a) => a.type === "cycling"
                        );
                        if (cyclingActivities.length === 0) return "-";
                        const totalDistance = cyclingActivities.reduce(
                          (sum, act) => sum + act.distance,
                          0
                        );
                        return (
                          (totalDistance / cyclingActivities.length).toFixed(
                            1
                          ) + " km"
                        );
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg text-gray-800 mb-6">
                Recent Achievements
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg border border-orange-100 p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16">
                    <div className="absolute transform rotate-45 bg-orange-500 text-white text-xs  py-1 right-[-35px] top-[15px] w-[110px] text-center">
                      New!
                    </div>
                  </div>
                  <div className="flex items-center mb-3">
                    <Award className="h-6 w-6 text-orange-500 mr-2" />
                    <h4 className="font-bold text-gray-800">Distance Record</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    You set a new personal best for longest distance in a single
                    activity!
                  </p>
                  <div className="bg-white rounded-md px-3 py-2 text-center">
                    <span className="text-xl font-bold text-orange-500">
                      {Math.max(...activities.map((a) => a.distance)).toFixed(
                        1
                      )}{" "}
                      km
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100 p-4">
                  <div className="flex items-center mb-3">
                    <Award className="h-6 w-6 text-blue-500 mr-2" />
                    <h4 className="font-bold text-gray-800">Consistency</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    You're building a great streak with regular activities,
                    Congratulation!
                  </p>
                  <div className="bg-white rounded-md px-3 py-2 text-center">
                    <span className="text-xl font-bold text-blue-500">
                      5 Days
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border border-green-100 p-4">
                  <div className="flex items-center mb-3">
                    <Flame className="h-6 w-6 text-green-500 mr-2" />
                    <h4 className="font-bold text-gray-800">
                      Calorie Milestone
                    </h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    You've burned over 2,000 calories this month, keep going.
                    Great Job!
                  </p>
                  <div className="bg-white rounded-md px-3 py-2 text-center">
                    <span className="text-xl font-bold text-green-500">
                      {stats.totalCalories.toLocaleString()} kcal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-md mr-2">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-bold">
                FIT<span className="text-orange-500">TRACK</span>
              </span>
            </div>

            <div className="text-gray-400 text-sm">
              © 2025 FitTrack - Track your fitness journey with style
            </div>

            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Help
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FitnessTracker;
