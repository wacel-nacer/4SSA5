import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ConferanceList } from './conferance-list/conferance-list';
import { ConferanceDetails } from './conferance-details/conferance-details';
import { Notfound } from './notfound/notfound';

export const routes: Routes = [
    {path:'home',component:Home},
    {path:'list',component:ConferanceList},
    {path:'list/new',component:ConferanceDetails},
    {path:'list/:id/edit',component:ConferanceDetails},
    {path:'',redirectTo:'home',pathMatch:'full'},
    {path:'**',component:Notfound},

];
