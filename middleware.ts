import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: async ({ req, token }) => {
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "admin";
      }
      if (req.nextUrl.pathname.startsWith("/dashboard")) {
        return !!token;
      }
      return true;
    },
  },
});
