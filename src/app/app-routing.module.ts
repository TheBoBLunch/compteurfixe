import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UpComponent } from './up';
import { DownComponent } from './down';
import { ResetComponent } from './reset';

const routes: Routes = [
    { path: 'up', component: UpComponent },
    { path: 'down', component: DownComponent },
	{ path: 'reset', component: ResetComponent },

    // otherwise redirect to up
    { path: '**', redirectTo: 'up' }
    ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
