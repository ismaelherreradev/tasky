import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

const isOrgRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/board(.*)",
  "/organization(.*)",
]);

const isProtectedApiRoute = createRouteMatcher(["/api/trpc(.*)"]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const { userId, orgId, redirectToSignIn } = await auth();

  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  if (!userId) {
    return redirectToSignIn({ returnBackUrl: request.url });
  }

  if (isOrgRoute(request) && !orgId) {
    const selectOrgUrl = new URL("/select-org", request.url);
    selectOrgUrl.searchParams.set("returnUrl", request.url);
    return NextResponse.redirect(selectOrgUrl);
  }

  if (isProtectedApiRoute(request) && !userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
