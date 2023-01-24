import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
  console.log(`<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ${request.url}`);
  const contentApiUrl = process.env.CONTENT_API_BASE_URL;
  const redirects = (await (
    await fetch(`${contentApiUrl}/redirects`)
  ).json()) as {
    source: string;
    destination: string;
  }[];
  console.log(redirects);
  const rewriteRule = redirects.find(({ source }) => {
    const regex = new RegExp(source);
    return regex.test(request.url) ? regex : undefined;
  });

  if (rewriteRule != null) {
    const nextUrl = request.url.replace(
      new RegExp(rewriteRule.source),
      rewriteRule.destination,
    );
    console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>> Redirecting to ${nextUrl}`);
    return NextResponse.redirect(new URL(nextUrl, request.url));
  }

  console.log('No redirect');
  return NextResponse.next();
}

// export const config = {
//   matcher: '/find-statistics',
// }

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
