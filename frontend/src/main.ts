// main.ts
import { bootstrapApplication }   from '@angular/platform-browser';
import { importProvidersFrom }     from '@angular/core';
import { provideRouter }          from '@angular/router';
import { HttpClientModule }       from '@angular/common/http';

import { App}           from './app/app';
import { HwList }      from './app/hw-list/hw-list';
import { HwCreate }    from './app/hw-create/hw-create';
import { HomePage } from './app/home-page/home-page';

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideRouter([
      { path: '', component: HomePage },          // HomePage shows on /
      { path: 'hws', component: HwList },
      { path: 'hws/create', component: HwCreate },
      { path: '**', redirectTo: '' }               // Wildcards redirect to home page
    ])
  ]
});
