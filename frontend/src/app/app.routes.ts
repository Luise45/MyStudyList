import { provideRouter, Routes } from '@angular/router';
import { HwList } from './hw-list/hw-list';
import { HwCreate } from './hw-create/hw-create';



import { HomePage } from './home-page/home-page';


import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app';

export const routes: Routes = [

{path: '', component: HomePage },   
{path: 'hws', component: HwList},
{path:'hws/create', component:HwCreate}


];

export const AppRoutes = provideRouter(routes);

bootstrapApplication(App, {

    providers:[AppRoutes]
});
