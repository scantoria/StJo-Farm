import 'zone.js'; // Must be imported before Angular
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => {
    console.error('Application failed to bootstrap:', err);
    // Show error on page for easier debugging
    document.body.innerHTML = `
      <div style="padding: 20px; color: red; font-family: monospace;">
        <h2>Application Bootstrap Error</h2>
        <pre>${err.message || err}</pre>
        <p>Check the browser console for full error details.</p>
      </div>
    `;
  });
