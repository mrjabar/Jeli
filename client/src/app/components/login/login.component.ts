import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  message;
  messageClass;
  dataRegister: any = {};
  processing = false;
  form: FormGroup;
  usernameValid;
  usernameMessage;


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router

  ) {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateUsername

      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validatePassword

      ])],
    });
  }

  disableForm() {
    this.form.controls.username.disable();
    this.form.controls.password.disable();
  }

  enableForm() {
    this.form.controls.username.enable();
    this.form.controls.password.enable();
  }

  validateUsername(controls) {
    const regExp = new
    RegExp(/^[a-zA-Z0-9]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateUsername : true};
    }
  }

  validatePassword(controls) {
    const regExp = new
    RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validatePassword : true};
    }
  }

  // get f() { return this.form.controls; }

  onLoginSubmit() {
    this.processing = true;
    this.disableForm();
    const user = {
      username: this.form.get('username').value,
      password: this.form.get('password').value
    };
    this.authService.login(user).subscribe(data => {
      this.dataRegister = data;
      if (!this.dataRegister.success) {
        this.messageClass = 'alert alert-danger';
        this.message = this.dataRegister.message;
        this.processing = false;
        this.enableForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = this.dataRegister.message;
        this.authService.storeUserData(this.dataRegister.token, this.dataRegister.user);
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      }
    });
  }

  onReset() {
    // this.submitted = false;
    this.form.reset();
}

  ngOnInit() {
  }

}
