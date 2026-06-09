export function adminRouteHandler(request: { body: { role?: string } }) {
  const userRole = request.body.role;

  if (userRole !== "admin") {
    return { status: 403, body: { message: "Forbidden" } };
  }

  return { status: 200, body: { message: "Welcome, admin." } };
}
