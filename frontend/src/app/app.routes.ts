import { provideRouter, Routes } from '@angular/router';
import { HwList } from './hw-list/hw-list';
import { HwCreate } from './hw-create/hw-create';


import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app';

export const routes: Routes = [

{path: '', redirectTo:'hws', pathMatch:'full'},
{path: 'hws', component: HwList},
{path:'hws/create', component:HwCreate}


];

export const AppRoutes = provideRouter(routes);

bootstrapApplication(App, {

    providers:[AppRoutes]
});
