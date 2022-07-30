import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { LoadScreenComponent } from '../components/load-screen/load-screen.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: string | null = '';
  shouldShowProgress = 0;

  constructor(private router: Router, private dialog: MatDialog) {}

  showProgress() {
    this.shouldShowProgress += 1;
    if (this.shouldShowProgress > 0) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.width = '10rem';
      dialogConfig.height = '10rem';
      this.dialog.open(LoadScreenComponent, dialogConfig);
    }
  }

  hideProgress() {
    this.shouldShowProgress -= 1;
    if (this.shouldShowProgress < 1) {
      this.dialog.closeAll();
      this.shouldShowProgress = 0;
    }
  }

  getUserIdFromToken() {
    var token = localStorage.getItem('token') || '{}';
    var decoded = jwtDecode<any>(token);
    if ('user_id' in decoded) {
      return decoded['user_id'];
    }
    return '';
  }

  gotoAuthorizedPages() {
    if (this.isValidTokenAvailable()) {
      this.router.navigate(['/home']);
    }
  }

  isValidTokenAvailable() {
    this.token = localStorage.getItem('token');
    if (this.token !== null && this.token != '') {
      return !this.tokenExpired(this.token);
    }
    return false;
  }

  tokenExpired(token: string) {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }

  signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['auth/login']);
  }

  getUserEmailFromToken() {
    var token = localStorage.getItem('token') || '{}';
    var decoded = jwtDecode<any>(token);
    if ('email' in decoded) {
      return decoded['email'];
    }
    return '';
  }
}
