import {
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';

import {
  delay,
  of,
} from 'rxjs';

/**
 * Mock HTTP interceptor to simulate API endpoints for demonstration purposes.
 * This interceptor catches specific API calls and returns mock responses.
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  // Intercept username availability check
  if (req.url === '/api/check-username' && req.method === 'POST') {
    const body = req.body as { username: string };
    const username = body?.username?.toLowerCase();

    // Simulate taken usernames
    const takenUsernames = ['admin', 'user', 'test', 'root', 'system'];
    const isAvailable = !takenUsernames.includes(username);

    // Simulate network delay (500ms-1500ms)
    const delayMs = Math.random() * 1000 + 500;

    const mockResponse = new HttpResponse({
      status: 200,
      body: {
        available: isAvailable,
        username: username,
        message: isAvailable
          ? 'Username is available'
          : 'Username is already taken',
      },
    });

    return of(mockResponse).pipe(delay(delayMs));
  }

  // Intercept slug availability check (for future examples)
  if (req.url === '/api/check-slug' && req.method === 'POST') {
    const body = req.body as { slug: string };
    const slug = body?.slug?.toLowerCase();

    const takenSlugs = ['admin', 'api', 'blog', 'home', 'about'];
    const isAvailable = !takenSlugs.includes(slug);

    const delayMs = Math.random() * 800 + 400;

    const mockResponse = new HttpResponse({
      status: 200,
      body: {
        available: isAvailable,
        slug: slug,
      },
    });

    return of(mockResponse).pipe(delay(delayMs));
  }

  // Let other requests pass through
  return next(req);
};
