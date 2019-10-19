import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { BlogService } from 'src/app/services/blog.service';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  messageClass;
  message;
  newPost = false;
  loadingBlogs = false;
  form;
  processing = false;
  user;
  username;
  email;
  dataRegister: any = {};
  blogPosts;


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService

  ) {
    this.createNewBlogForm();
  }

  createNewBlogForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5)
      ])],
    });
  }

  enableNewPostForm() {
    this.form.controls.title.enable();
    this.form.controls.body.enable();
  }

  disableNewPostForm() {
    this.form.controls.title.disable();
    this.form.controls.body.disable();
  }

  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { alphaNumericValidation : true};
    }
  }

  newBlogForm() {
    this.newPost = true;
  }

  reloadBlogs() {
    this.loadingBlogs = true;
    this.getAllBlogs();
    setTimeout(() => {
      this.loadingBlogs = false;
    }, 4000);
  }

  draftComment() {

  }

  onBlogSubmit() {
    this.processing = true;
    this.disableNewPostForm();
    const blog = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      createdBy: this.user
    };
    this.blogService.newBlog(blog)
      .subscribe(data => {
        this.dataRegister = data;
        if (!this.dataRegister.success) {
          this.messageClass = 'alert alert-danger';
          this.message = this.dataRegister.message;
          this.processing = false;
          this.enableNewPostForm();
        } else {
          this.messageClass = 'alert alert-success';
          this.message = this.dataRegister.message;
          this.getAllBlogs();
          setTimeout(() => {
            this.newPost = false;
            this.processing = false;
            this.message = false;
            this.form.reset();
            this.enableNewPostForm();
          }, 2000);
        }
      });
    }

  goBack() {
    window.location.reload();
  }

  getAllBlogs() {
    this.blogService.getAllBlogs().subscribe(data => {
      this.dataRegister = data;
      this.blogPosts = this.dataRegister.blogs;
    });
  }
  //   ngOnInit() {
  //   this.authService.getProfile().subscribe(profile => {
  //     this.username = profile[this.username];
  //     this.email = profile[this.email];

  //   });
  // }

  likeBlog(id) {
    this.blogService.likeBlog(id).subscribe(data => {
      this.getAllBlogs();
    });
  }

  dislikeBlog(id) {
    this.blogService.dislikeBlog(id).subscribe(data => {
      this.getAllBlogs();
    });

  }


  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.user = (profile as any).user;
    });
    this.getAllBlogs();
  }
}
