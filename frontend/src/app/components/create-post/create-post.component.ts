import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PostsService, CreatePostRequest } from '../../services/posts.service';
import { GSAPService } from '../../services/gsap.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="create-post-container min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-chronolink-primary font-display">ChronoLink</h1>
            </div>
            <div class="flex items-center space-x-4">
              <!-- Navigation -->
              <nav class="hidden md:flex space-x-6">
                <a routerLink="/home" class="text-gray-600 hover:text-chronolink-primary transition-colors duration-200">Home</a>
                <a routerLink="/connect" class="text-gray-600 hover:text-chronolink-primary transition-colors duration-200">Connect</a>
                <a routerLink="/ai-recommendations" class="text-gray-600 hover:text-chronolink-primary transition-colors duration-200">AI Recommendations</a>
                <a routerLink="/profile" class="text-gray-600 hover:text-chronolink-primary transition-colors duration-200">Profile</a>
              </nav>
              <button class="text-gray-600 hover:text-chronolink-primary transition-colors duration-200">
                <i class="fas fa-bell text-xl"></i>
              </button>
              <button class="text-gray-600 hover:text-chronolink-primary transition-colors duration-200">
                <i class="fas fa-cog text-xl"></i>
              </button>
              <div class="w-8 h-8 bg-chronolink-primary rounded-full flex items-center justify-center cursor-pointer" (click)="goToProfile()">
                <span class="text-white text-sm font-medium">{{ getInitials(currentUser?.username) }}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-lg shadow-sm p-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Create New Post</h2>
          <p class="text-gray-600 mb-8">Share your story with the ChronoLink community</p>

          <form [formGroup]="postForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Title Field -->
            <div class="form-group">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                id="title"
                formControlName="title"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chronolink-primary focus:border-transparent transition-all duration-200"
                placeholder="Enter your post title">
              <div *ngIf="postForm.get('title')?.invalid && postForm.get('title')?.touched" class="text-red-500 text-sm mt-1">
                Title is required
              </div>
            </div>

            <!-- Category Field -->
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                formControlName="category"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chronolink-primary focus:border-transparent transition-all duration-200">
                <option value="">Select a category</option>
                <option value="Spirituality">Spirituality</option>
                <option value="Literature">Literature</option>
                <option value="Art">Art</option>
                <option value="Heritage">Heritage</option>
                <option value="Inspiration">Inspiration</option>
                <option value="Technology">Technology</option>
                <option value="Music">Music</option>
                <option value="History">History</option>
              </select>
              <div *ngIf="postForm.get('category')?.invalid && postForm.get('category')?.touched" class="text-red-500 text-sm mt-1">
                Category is required
              </div>
            </div>

            <!-- Content Field -->
            <div class="form-group">
              <label for="content" class="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                id="content"
                formControlName="content"
                rows="8"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chronolink-primary focus:border-transparent transition-all duration-200"
                placeholder="Share your story, wisdom, or experience..."></textarea>
              <div *ngIf="postForm.get('content')?.invalid && postForm.get('content')?.touched" class="text-red-500 text-sm mt-1">
                Content is required
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                (click)="goBack()"
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                Cancel
              </button>

              <button
                type="submit"
                [disabled]="postForm.invalid || isLoading"
                class="px-8 py-3 bg-chronolink-primary text-white rounded-lg font-medium transition-all duration-200 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                <span *ngIf="isLoading" class="inline-flex items-center">
                  <div class="spinner mr-2"></div>
                  Creating Post...
                </span>
                <span *ngIf="!isLoading">Create Post</span>
              </button>
            </div>
          </form>

          <!-- Success Message -->
          <div *ngIf="successMessage" class="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {{ successMessage }}
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .create-post-container {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .font-display {
      font-family: 'Playfair Display', serif;
    }
  `]
})
export class CreatePostComponent implements OnInit, OnDestroy {
  postForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  currentUser: any = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private postsService: PostsService,
    private gsapService: GSAPService,
    private router: Router
  ) {
    this.postForm = this.createForm();
  }

  ngOnInit(): void {
    this.animateEntry();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      category: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid) return;

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const postData: CreatePostRequest = {
      ...this.postForm.value,
      mediaType: 'text'
    };

    this.postsService.createPost(postData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'Post created successfully!';
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 2000);
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to create post';
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  getInitials(username: string | undefined): string {
    if (!username) return 'U';
    return username.substring(0, 2).toUpperCase();
  }

  private animateEntry(): void {
    this.gsapService.animateFrom('header', {
      duration: 0.6,
      y: -50,
      opacity: 0,
      ease: 'power2.out'
    });

    this.gsapService.animateFrom('h2', {
      duration: 0.6,
      y: -30,
      opacity: 0,
      delay: 0.2,
      ease: 'power2.out'
    });

    this.gsapService.animateFrom('.form-group', {
      duration: 0.5,
      y: 20,
      opacity: 0,
      stagger: 0.1,
      delay: 0.4,
      ease: 'power2.out'
    });
  }
}
