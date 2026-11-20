export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/demo/')) return demoAction(request, env, url);
    if (url.pathname === '/account/callback' && request.method === 'GET') return accountCallback(request, env, url);
    if (url.pathname.startsWith('/account/')) return accountAction(request, env, url);
    if (url.pathname.startsWith('/api/')) {
      if (!sameOrigin(request, url)) return json({ error:'forbidden' }, 403);
      const session = await siteSession(request, env);
      try {
        if (session.unavailable) return json({ error:'unavailable' }, 503);
        const response = url.pathname === '/api/profile' && request.method === 'GET' ?
          (session.role ? json({ name: accountName(session.user), email: session.user.email, role: session.role, admin:!session.demo&&session.user.app_metadata?.chemistry_atlas_admin===true }) : json({ error:'signin' }, 401)) :
          await classroom(request, env, session, url);
        return withCookies(response, session.cookies);
      } catch { return withCookies(json({ error:'unavailable' }, 503), session.cookies); }
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response(null, { status: 405 });
    const asset = Object.hasOwn(assets, url.pathname) && assets[url.pathname];
    if (asset) {
      const body = request.method === 'HEAD' ? null :
        asset.base64 ? Uint8Array.from(atob(asset.base64), char => char.charCodeAt(0)) : asset.body;
      return new Response(body, { headers: { 'Content-Type': asset.type, 'Cache-Control': 'no-cache' } });
    }
    if (!['/', '/index.html'].includes(url.pathname)) return new Response('Not found', { status: 404 });

    const session = await siteSession(request, env);
    const role = session.role || '';
    const account = session.demo ? 'demo-' + session.demo.id + '-' + role :
      role && /^[a-f0-9-]{36}$/i.test(session.user.id) ? session.user.id : '';
    const body = page.replace('data-role=""', 'data-role="' + role + '" data-account="' + account + '"' +
      (session.demo ? ' data-demo="true"' : ''));
    return withCookies(new Response(request.method === 'HEAD' ? null : body, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'same-origin' }
    }), session.cookies);
  }
};
