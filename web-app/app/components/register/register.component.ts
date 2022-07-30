import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Auth,
  createUserWithEmailAndPassword,
  UserCredential,
} from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import * as FireDb from '@angular/fire/database';
import { getDatabase, update } from 'firebase/database';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  hide = true;
  email: FormControl = new FormControl('', [
    Validators.email,
    Validators.required,
  ]);
  password: FormControl = new FormControl('', Validators.required);
  name: FormControl = new FormControl('', Validators.required);
  registerForm = new FormGroup({});

  constructor(
    private router: Router,
    private auth: Auth,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.registerForm.addControl('email', this.email);
    this.registerForm.addControl('password', this.password);
    this.registerForm.addControl('name', this.name);
    this.authService.gotoAuthorizedPages();
  }

  redirectToLoginScreen() {
    this.router.navigate(['auth/login']);
  }

  registerUser() {
    if (!this.registerForm.valid) {
      alert('Form invalid');
    } else {
      this.authService.showProgress();
      createUserWithEmailAndPassword(
        this.auth,
        this.registerForm.get('email')?.value,
        this.registerForm.get('password')?.value
      ).then(
        (result: UserCredential) => {
          
          const userRef = FireDb.ref(
            getDatabase(),
            'Users/' + result.user.uid
          );
          update(userRef, {
            name: this.registerForm.get('name')?.value,
            email: this.registerForm.get('email')?.value,
          });

          result.user.getIdToken().then(
            (token) => {
              localStorage.setItem('token', token.toString());
              localStorage.setItem(
                'refresh_token',
                result.user.refreshToken.toString()
              );
              this.router.navigate(['']);
              this.authService.hideProgress();
            },
            (e) => {
              this.authService.hideProgress();
              alert('Failed to create user');
            }
          );
        },
        (er) => {
          this.authService.hideProgress();
          alert('Failed to create user');
          console.log(er);
        }
      );
    }
  }
}
