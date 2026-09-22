import { Routes, Route } from "react-router-dom";
import "./App.css";

import PublicLayout from "./components/layout/PublicLayout";
import AppLayout from "./components/layout/AppLayout";
import AdminLayout from "./components/layout/AdminLayout";
import RepresentativeApplications from "./pages/admin/RepresentativeApplications";
import RepresentativeApplicationDetail from "./pages/admin/RepresentativeApplicationDetail";
import UserManagement from "./pages/admin/UserManagement";
import Moderation from "./pages/admin/Moderation";
import AdminHome from "./pages/admin/AdminHome";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleBasedRoute from "./routes/RoleBasedRoute";

import Landing from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import CreateCommunityRequest from "./pages/CreateCommunityRequest";
import CitizenHome from "./pages/CitizenHome";
import IssueDetail from "./pages/IssuesDetail";
import Issues from "./pages/Issues";
import ReportIssue from "./pages/ReportIssue";
import Profile from "./pages/Profile";
import CommunityProposals from "./pages/Proposals";
import SavedIssues from "./pages/savedIssues";
import Notifications from "./pages/Notifications";
import ChangeCommunity from "./pages/ChangeCommunity";
import EditProfile from "./pages/EditProfile";

function App() {
  return (
    <Routes>
      {/* Public layout — your Navbar + Footer wrap these */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Auth pages — no Navbar/Footer, they render their own centered card */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup/onboarding" element={<Onboarding />} />
      <Route
        path="/signup/community-request"
        element={<CreateCommunityRequest />}
      />

      {/* Protected app layout — sidebar, no public Navbar/Footer at all */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/citizen-home" element={<CitizenHome />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/issues/:issueId" element={<IssueDetail />} />
          <Route path="/report-issue" element={<ReportIssue />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/proposals" element={<CommunityProposals />} />
          <Route path="/communities" element={<ChangeCommunity />} />
          <Route path="/saved-issues" element={<SavedIssues />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile/edit" element={<EditProfile />} />
        </Route>

        {/* Admin-only — non-admins are redirected to their own home.
            Sits beside AppLayout (not inside it) so admin pages can use their own layout. */}
        <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin-home" element={<AdminHome />} />
            <Route
              path="/admin/representative-applications"
              element={<RepresentativeApplications />}
            />
            <Route
              path="/admin/representative-applications/:applicationId"
              element={<RepresentativeApplicationDetail />}
            />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/moderation" element={<Moderation />} />
            {/* more admin pages (/admin/communities, ...) go here */}
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
