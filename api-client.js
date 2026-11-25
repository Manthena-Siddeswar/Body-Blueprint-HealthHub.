/* Small frontend API adapter: keeps network concerns out of dashboard calculations. */
(function () {
  async function request(url, options = {}) {
    const response = await fetch(url, {
      method: options.method || 'GET',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      body: options.body === undefined ? undefined : JSON.stringify(options.body)
    });
    const payload = response.status === 204 ? {} : await response.json().catch(() => ({}));
    if (!response.ok) { const error = new Error(payload.error || `Request failed (${response.status})`); error.status = response.status; throw error; }
    return payload;
  }
  window.BBAPI = {
    request,
    isAuthenticated: () => Boolean(localStorage.getItem('bbSession')),
    bootstrap: async () => {
      const me = await request('/api/auth/me');
      const state = await request('/api/state');
      return { user: me.user, state: state.state };
    },
    saveState: state => request('/api/state', { method: 'PUT', body: state })
  };
})();
