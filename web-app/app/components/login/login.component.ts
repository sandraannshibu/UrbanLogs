import { Component, OnInit } from '@angular/core';
import { Auth, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;
  email: FormControl = new FormControl('', [
    Validators.email,
    Validators.required,
  ]);
  password: FormControl = new FormControl('', Validators.required);
  loginForm = new FormGroup({});

  constructor(private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private auth: Auth) 
    { }

  ngOnInit(): void {
    this.loginForm.addControl('email', this.email);
    this.loginForm.addControl('password', this.password);
    this.authService.gotoAuthorizedPages();
  }

  redirectToRegisterScreen(){
    this.router.navigate(['auth/register'],)
  }

  loginUser() {
    if (!this.loginForm.valid) {
      alert('Form invalid');
    } else {
      this.authService.showProgress();
      signInWithEmailAndPassword(
        this.auth,
        this.loginForm.get('email')?.value,
        this.loginForm.get('password')?.value
      ).then(
        (result: UserCredential) => {
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
              alert('Failed to log-in user');
              this.authService.hideProgress();
            }
          );
        },
        (er) => {
          this.authService.hideProgress();
          alert('Failed to log-in user');
          console.log(er);
        }
      );
    }
  }

}
