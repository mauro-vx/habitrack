import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// export async function middleware(request: NextRequest) {
//
//   const basicAuth = request.headers.get('authorization');
//
//   // Check and validate Basic Authentication credentials
//   if (basicAuth) {
//     // Basic auth format is "Basic <base64encoded>"
//     const authValue = basicAuth.split(' ')[1];
//     try {
//       const [user, pwd] = atob(authValue).split(':');
//
//       if (user === process.env.BASIC_AUTH_USER && pwd === process.env.BASIC_AUTH_PASSWORD
//       ) {
//         return await updateSession(request);
//       }
//     } catch (error) {
//       console.error("Basic auth decoding error:", error);
//     }
//   }
//
//   // If we reach here, authentication failed or wasn't provided
//   // Return a 401 response with the WWW-Authenticate header
//   return new NextResponse(null, {
//     status: 401,
//     headers: {
//       'WWW-Authenticate': 'Basic realm="Secure Area"',
//       'Content-Type': 'text/plain'
//     }
//   });
// }
//
// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
