import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  iat: number;
  jti: string;
  sub: string;
}

export function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/auth/login";

  // Statik fayllar va rasmlar uchun middleware ishlamasligi kerak
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/static") ||
    request.nextUrl.pathname.endsWith(".svg") ||
    request.nextUrl.pathname.endsWith(".png") ||
    request.nextUrl.pathname.endsWith(".jpg") ||
    request.nextUrl.pathname.endsWith(".jpeg")
  ) {
    return NextResponse.next();
  }

  try {
    const isAuthenticated = checkAuthStatus(request);

    if (isAuthenticated && isLoginPage) {
      // Agar foydalanuvchi autentifikatsiya qilingan bo'lsa va login sahifasiga kirmoqchi bo'lsa
      return NextResponse.redirect(new URL("/dashboard/home", request.url));
    }

    if (!isAuthenticated && !isLoginPage) {
      // Agar foydalanuvchi autentifikatsiya qilinmagan bo'lsa va boshqa sahifaga kirmoqchi bo'lsa
      return redirectToLogin(request);
    }

    return NextResponse.next();
  } catch (error) {
    // Token yaroqsiz bo'lsa yoki boshqa xatolik yuz bersa
    console.error("Authentication error:", error);
    // Har qanday xatolik yuz berganda login sahifasiga yo'naltirish
    return redirectToLogin(request);
  }
}

function checkAuthStatus(request: NextRequest): boolean {
  const token = request.cookies.get("access_token");

  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwtDecode<DecodedToken>(token.value);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Token decoding error:", error);
    return false;
  }
}

function redirectToLogin(request: NextRequest): NextResponse {
  const response = NextResponse.redirect(new URL("/auth/login", request.url));

  // Cookie'larni tozalash
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
