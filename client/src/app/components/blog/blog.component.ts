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
  commentForm;
  processing = false;
  user;
  username;
  email;
  dataRegister: any = {};
  blogPosts;
  newComment = [];
  enabledComments = [];


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService

  ) {
    this.createNewBlogForm();
    this.createCommentForm();
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

  createCommentForm() {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(200),
        Validators.minLength(1),
        this.alphaNumericValidation
      ])]
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

  enableCommentForm() {
    this.commentForm.controls.comment.enable();
  }

  disableCommentForm() {
    this.commentForm.controls.comment.disable();
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

  draftComment(id) {
    this.commentForm.reset();
    this.newComment = [];
    this.newComment.push(id);
  }

  cancelSubmit(id) {
    const index = this.newComment.indexOf(id);
    this.newComment.splice(index, 1);
    this.commentForm.reset();
    this.enableCommentForm();
    this.processing = false;
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

  postComment(id) {
    this.disableCommentForm();
    this.processing = true;
    const comment  = this.commentForm.get('comment').value;
    this.blogService.postComment(id, comment).subscribe(data => {
      this.getAllBlogs();
      const index = this.newComment.indexOf(id);
      this.newComment.splice(index, 1);
      this.enableCommentForm();
      this.commentForm.reset();
      this.processing = false;
      if (this.enabledComments.indexOf(id) < 0) { this.expand(id); }
    });
  }

  expand(id) {
    this.enabledComments.push(id);
  }

  collapse(id) {
    const index = this.enabledComments.indexOf(id);
    this.enabledComments.splice(index, 1);
  }


  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.user = (profile as any).user;
    });
    this.getAllBlogs();
  }
}
