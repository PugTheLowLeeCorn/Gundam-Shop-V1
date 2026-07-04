export function requireAuth(user) {
  if (!user) {
    throw new Error("You must be logged in to perform this action");
  }
  return user;
}

export function requireCustomer(user) {
  const authUser = requireAuth(user);
  if (authUser.role !== "customer") {
    throw new Error("Only customers can perform this action");
  }
  return authUser;
}

export function requireAdmin(user) {
  const authUser = requireAuth(user);
  if (authUser.role !== "admin") {
    throw new Error("Only admins can perform this action");
  }
  return authUser;
}
