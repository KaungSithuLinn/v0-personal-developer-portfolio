import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check for the x-middleware-subrequest header that could be used in the bypass attack
  const middlewareSubrequest = request.headers.get("x-middleware-subrequest")

  // If this header is present in an external request, it could be an attempt to bypass middleware
  // Block requests with this header unless they're legitimate internal requests
  if (middlewareSubrequest && !isLegitimateInternalRequest(request)) {
    return new NextResponse(null, {
      status: 403,
      statusText: "Forbidden",
    })
  }

  return NextResponse.next()
}

// Helper function to determine if a request is a legitimate internal request
// You may need to customize this based on your application's architecture
function isLegitimateInternalRequest(request: NextRequest): boolean {
  // Check if the request is coming from a trusted source
  // This is a simplified example - you should implement proper validation
  const referer = request.headers.get("referer")
  const host = request.headers.get("host")

  // If the request is from the same host, it's likely legitimate
  if (referer && host && referer.includes(host)) {
    return true
  }

  return false
}

// Only run middleware on specific paths that need protection
export const config = {
  matcher: [
    // Add paths that use middleware and need protection
    "/api/:path*",
    "/dashboard/:path*",
    // Add other protected routes as needed
  ],
}
