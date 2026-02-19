import { Routes } from '@angular/router';
import { CustomerHomeComponent } from './pages/customer-home/customer-home.component';
import { CustomerChatComponent } from './pages/customer-chat/customer-chat.component';

export const routes: Routes = [
    { path: '', component: CustomerHomeComponent },
    { path: 'chat', component: CustomerChatComponent },
];
