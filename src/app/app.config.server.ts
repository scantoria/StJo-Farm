import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { serverRoutes } from './app.routes.server';

// Server config without Firebase (Firebase doesn't work with SSR)
const serverConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideServerRendering(withRoutes(serverRoutes))
  ]
};

export const config = serverConfig;
