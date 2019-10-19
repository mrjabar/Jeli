import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { from } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {
 message;
 messageClass;
 processing = false;
 currentUrl;
 dataRegister: any = {};
 loading = true;
 blog;

  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService ) { }

  updateBlogSubmit() {
    this.processing = true;
    this.blogService.editBlog(this.blogService).subscribe(data => {
      this.dataRegister = data;
      if (!this.dataRegister.success) {
        this.messageClass = 'alert alert-danger';
        this.message = this.dataRegister.message;
        this.processing = false;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = this.dataRegister.message;
        setTimeout(() => {
          this.router.navigate(['/blog']);
        }, 2000);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  // ngOnInit() {
  //   this.currentUrl = this.activatedRoute.snapshot.params;
  //   this.blogService.getBlog(this.currentUrl.id).subscribe( data => {
  //     this.dataRegister = data;
  //     this.blog = this.dataRegister.blog;
  //     this.loading = false;
  // });
  // }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getBlog(this.currentUrl.id).subscribe( data => {
      this.dataRegister = data;
      if (!this.dataRegister.success) {
        this.messageClass = 'alert alert-danger';
        this.message = 'Blog not found';
      } else {
        this.blog = this.dataRegister.blog;
        this.loading = false;
      }
  });
  }

}
