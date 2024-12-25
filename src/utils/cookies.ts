type CookieKey = 'token-auth' | string & {}

export function getCookie(name: CookieKey): string | undefined {
   // console.log(name);   

   let matches = globalThis?.document?.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
   ));
   return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function removeCookie(key: CookieKey) {
   const eqPos = key.indexOf('=');
   const name = eqPos > -1 ? key.substring(0, eqPos) : key;
   document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
}