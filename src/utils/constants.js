// Where each role lands after login, and where they're sent back to
// when they hit a route their role isn't allowed on.
export const getHomePath = (role) =>
  role === "admin" ? "/admin-home" : "/citizen-home";

export const APPLICATION_TYPE_LABELS = {
  found_new_community: "New community",
  represent_existing: "Represent existing",
};
