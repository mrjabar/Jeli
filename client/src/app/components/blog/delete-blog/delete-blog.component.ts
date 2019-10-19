import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BlogService } from 'src/app/services/blog.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-blog',
  templateUrl: './delete-blog.component.html',
  styleUrls: ['./delete-blog.component.css']
})
export class DeleteBlogComponent implements OnInit {

  message;
  messageClass;
  foundBlog = false;
  processing = false;
  currentUrl;
  dataRegister: any = {};
  blog;

  constructor(
    private location: Location,
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute,
  ) { }

  deleteBlog() {
  }

  goBack() {
    this.location.back();
  }


  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getBlog(this.currentUrl.id).subscribe(data => {
      this.dataRegister = data;
      if (!this.dataRegister.success) {
        this.messageClass = 'alert alert-danger';
        this.message = this.dataRegister.message;
        this.processing = false;
      } else {
        this.blog = {
          title: this.dataRegister.blog.title,
          body: this.dataRegister.blog.body,
          createtBy: this.dataRegister.blog.createtBy,
          createAt: this.dataRegister.blog.createdAt
        };
        this.foundBlog = true;
      }
    });
  }
}
