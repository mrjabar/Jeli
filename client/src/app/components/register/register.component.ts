import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  message;
  messageClass;
  dataRegister: any = {};
  processing = false;
  emailValid;
  emailMessage;
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
      fullName: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        this.validateFullName
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail
      ])],
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
      confirm: ['', Validators.required]
    }, { validator: this.matchingPasswords('password', 'confirm')});
  }

  disableForm() {
    this.form.controls.fullName.disable();
    this.form.controls.email.disable();
    this.form.controls.username.disable();
    this.form.controls.password.disable();
    this.form.controls.confirm.disable();
  }

  enableForm() {
    this.form.controls.fullName.enable();
    this.form.controls.email.enable();
    this.form.controls.username.enable();
    this.form.controls.password.enable();
    this.form.controls.confirm.enable();
  }

  validateFullName(controls) {
    const regExp = new
    RegExp(/^[A-Za-z][A-Za-z\'\-]+([\ A-Za-z][A-Za-z\'\-]+)*/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateFullName : true};
    }
  }

  validateEmail(controls) {
    const regExp = new
    RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
    if (regExp.test(controls.value)) {
       return null;
     } else {
       return { validateEmail : true};
     }
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

  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      if (group.controls[password].value === group.controls[confirm].value) {
        return null;
      } else {
        return { matchingPasswords: true };
      }
    };
  }

  onRegisterSubmit() {
    this.processing = true;
    this.disableForm();
    const user = {
      fullName: this.form.get('fullName').value,
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value
    };

    this.authService.registerUser(user).subscribe(data => {
      this.dataRegister = data;
      if (!this.dataRegister.success) {
        this.messageClass = 'alert alert-danger';
        this.message = this.dataRegister.message;
        this.processing = false;
        this.enableForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = this.dataRegister.message;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }
    });
  }

  checkEmail() {
    this.authService.checkEmail(this.form.get('email').value).subscribe(data => {
      this.dataRegister = data;
      if (!this.dataRegister.success) {
        this.emailValid = false;
        this.emailMessage = this.dataRegister.message;
        this.processing = false;
        this.enableForm();
      } else {
        this.emailValid = true;
        this.emailMessage = this.dataRegister.message;
      }
    });
  }

  checkUsername() {
    this.authService.checkUsername(this.form.get('username').value).subscribe(data => {
      this.dataRegister = data;
      if (!this.dataRegister.success) {
        this.usernameValid = false;
        this.usernameMessage = this.dataRegister.message;
        this.processing = false;
        this.enableForm();
      } else {
        this.usernameValid = true;
        this.usernameMessage = this.dataRegister.message;
      }
    });
  }

  ngOnInit() {
  }

}
