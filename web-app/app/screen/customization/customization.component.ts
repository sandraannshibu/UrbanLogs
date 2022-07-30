import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { getDatabase, update, ref, push } from '@angular/fire/database';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-customization',
  templateUrl: './customization.component.html',
  styleUrls: ['./customization.component.scss'],
})
export class CustomizationComponent implements OnInit {
  title: FormControl;
  description: FormControl;
  length: FormControl;
  breadth: FormControl;
  height: FormControl;

  customizationForm = new FormGroup({});

  constructor(private authService: AuthService,    private auth: Auth) {
    this.title = new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
    ]);

    this.description = new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(255),
    ]);
    this.length = new FormControl('', [
      Validators.required,
      Validators.pattern(/^[.\d]+$/),
      Validators.minLength(1),
      Validators.min(1),
      Validators.maxLength(2),
    ]);
    this.breadth = new FormControl('', [
      Validators.required,
      Validators.pattern(/^[.\d]+$/),
      Validators.minLength(1),
      Validators.min(1),
      Validators.maxLength(2),
    ]);
    this.height = new FormControl('', [
      Validators.required,
      Validators.pattern(/^[.\d]+$/),
      Validators.minLength(1),
      Validators.min(1),
      Validators.maxLength(2),
    ]);

    this.customizationForm.addControl('title', this.title);
    this.customizationForm.addControl('description', this.description);
    this.customizationForm.addControl('length', this.length);
    this.customizationForm.addControl('breadth', this.breadth);
    this.customizationForm.addControl('height', this.height);
  }

  saveForm() {
    if (this.customizationForm.invalid) {
      alert('Form invalid');
    } else {
      this.authService.showProgress();
      const uid = this.authService.getUserIdFromToken();
      const db = getDatabase();
      push(ref(db, 'customization-requests'), {
        title: this.title.value,
        description: this.description.value,
        dimension: {
          'length': this.length.value,
          'breadth': this.breadth.value,
          'height': this.height.value,
        },
        uid:this.authService.getUserIdFromToken(),
        email:this.authService.getUserEmailFromToken(),
        read: false,
      }).then(
        (res) => {
          this.authService.hideProgress();
          alert('Your request has been submitted. Our team will contact you in a few days')
          this.customizationForm.reset();
        },
        (err) => {
          console.log(err)
          this.authService.hideProgress();
        }
      );
    }
  }

  ngOnInit(): void {}
}
