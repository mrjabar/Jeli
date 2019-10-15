import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user;
  // username;
  // email;
  // fullName;
  // profileRegister: any = {};

  constructor(
    private authService: AuthService,
  ) { }

  // ngOnInit() {
  //   this.authService.getProfile().subscribe(profile => {
  //     this.username = profile[this.username];
  //     this.email = profile[this.email];

  //   });
  // }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.user = (profile as any).user;
    });
  }
}

