// helpers/tokenUtils.ts
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp?: number; // saniye cinsinden (Unix timestamp)
}

/**
 * Token'ın süresi geçmiş mi? (veya bozuk/yok)
 * Geçerliyse false, geçmiş/bozuk/yoksa true döner.
 */
export const isTokenExpired = (token?: string | null): boolean => {
  if (!token) return true;

  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    if (!exp) return true; // exp yoksa güvenli tarafta kal

    // exp saniye, Date.now() milisaniye. 5sn pay bırak (clock skew).
    const nowSec = Math.floor(Date.now() / 1000);
    return exp < nowSec + 5;
  } catch {
    // Decode edilemiyorsa bozuk = geçersiz say
    return true;
  }
};

/** localStorage'dan geçerli access token'ı al; yoksa/expired ise null */
export const getValidAccessToken = (): string | null => {
  const authUser = localStorage.getItem("authUser");
  if (!authUser) return null;
  try {
    const token = JSON.parse(authUser).token?.replace(/^"+|"+$/g, "").trim();
    return isTokenExpired(token) ? null : token;
  } catch {
    return null;
  }
};