'use server';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { projectsUrl } from './consts';

export async function middleware(request: NextRequest) {
   const tokenCookie = request.cookies.get('token-auth');
   const token = tokenCookie?.value;
   const response = NextResponse.next();
   if (token) {
      response.cookies.set('token-auth', token);
   }

   if (request.nextUrl.pathname.startsWith('/auth') && token) {
      return NextResponse.redirect(new URL('/project', request.url));
   }

   if (request.nextUrl.pathname.startsWith('/project') && token) {
      return response;
   } else if (request.nextUrl.pathname.startsWith('/project') && !token) {
      return NextResponse.redirect(new URL('/', request.url));
   }

   if (request.nextUrl.pathname.startsWith('/') && token) {
      return response;
   } else if (request.nextUrl.pathname.startsWith('/') && !token) {
      return response;
   }
}

export const config = {
   matcher: ['/', '/auth', `${projectsUrl}/:path*`],
};
