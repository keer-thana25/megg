import { Component, OnInit, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PostsService, Post } from '../../services/posts.service';
import { GSAPService } from '../../services/gsap.service';

@Component({
  selector: 'app-connect-generations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="connect-container min-h-screen bg-gradient-to-br from-older-generation-50 via-white to-younger-generation-50">
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
                <a routerLink="/connect" class="text-chronolink-primary font-medium">Connect</a>
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

      <!-- Page Header -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-chronolink-primary mb-4 font-display">Connecting the Generations</h1>
          <p class="text-xl text-gray-600">Bridging the gap between older and younger generations through shared stories</p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Animation Trigger Area -->
        <div class="animation-area mb-8">
          <div class="flex justify-center items-center space-x-8">
            <!-- Older Generation Side -->
            <div class="older-side text-center">
              <div class="w-16 h-16 bg-older-generation-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i class="fas fa-user text-2xl text-older-generation-700"></i>
              </div>
              <h3 class="text-lg font-semibold text-older-generation-800">Older Generation</h3>
              <p class="text-sm text-older-generation-600">Wisdom & Experience</p>
            </div>

            <!-- Animated Arrows -->
            <div class="arrows-container flex items-center space-x-4">
              <div class="arrow-left">
                <i class="fas fa-arrow-left text-2xl text-chronolink-primary"></i>
              </div>
              <div class="meeting-point w-4 h-4 bg-chronolink-secondary rounded-full"></div>
              <div class="arrow-right">
                <i class="fas fa-arrow-right text-2xl text-chronolink-primary"></i>
              </div>
            </div>

            <!-- Younger Generation Side -->
            <div class="younger-side text-center">
              <div class="w-16 h-16 bg-younger-generation-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i class="fas fa-user text-2xl text-younger-generation-700"></i>
              </div>
              <h3 class="text-lg font-semibold text-younger-generation-800">Younger Generation</h3>
              <p class="text-sm text-younger-generation-600">Innovation & Energy</p>
            </div>
          </div>
        </div>

        <!-- Flashcards Container -->
        <div class="flashcards-container relative">
          <div *ngIf="posts.length === 0 && !isLoading" class="text-center py-12">
            <i class="fas fa-sync-alt text-6xl text-gray-300 mb-4"></i>
            <p class="text-gray-500 text-lg">Loading generation connection stories...</p>
          </div>

          <div class="flashcards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let post of posts; trackBy: trackByPostId"
                 class="flashcard bg-white rounded-lg shadow-lg p-6 cursor-pointer"
                 [class.older-generation-theme]="post.generation === 'older'"
                 [class.younger-generation-theme]="post.generation === 'younger'"
                 (click)="flipCard($event)">
              <div class="flashcard-inner relative w-full h-64">
                <!-- Front of card -->
                <div class="flashcard-front absolute inset-0 w-full h-full backface-hidden bg-white rounded-lg p-6 flex flex-col justify-center items-center text-center">
                  <div class="mb-4">
                    <div class="w-12 h-12 bg-chronolink-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <span class="text-white text-sm font-medium">{{ getInitials(post.author.username) }}</span>
                    </div>
                    <h3 class="font-semibold text-gray-900">{{ post.author.username }}</h3>
                    <p class="text-sm text-gray-600">{{ post.author.generation | titlecase }} Generation</p>
                  </div>
                  <div class="flex-1 flex items-center justify-center">
                    <p class="text-gray-700 font-medium">{{ post.title }}</p>
                  </div>
                  <div class="mt-4">
                    <span class="px-3 py-1 rounded-full text-xs font-medium"
                          [class.bg-older-generation-100]="post.generation === 'older'"
                          [class.text-older-generation-800]="post.generation === 'older'"
                          [class.bg-younger-generation-100]="post.generation === 'younger'"
                          [class.text-younger-generation-800]="post.generation === 'younger'">
                      {{ post.category }}
                    </span>
                  </div>
                </div>

                <!-- Back of card -->
                <div class="flashcard-back absolute inset-0 w-full h-full backface-hidden bg-gray-50 rounded-lg p-6 flex flex-col justify-center items-center text-center transform rotate-y-180">
                  <div class="flex-1 flex items-center justify-center">
                    <p class="text-gray-700 leading-relaxed">{{ post.content | slice:0:200 }}{{ post.content.length > 200 ? '...' : '' }}</p>
                  </div>
                  <div class="mt-4 text-sm text-gray-500">
                    Click to flip back
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div *ngIf="posts.length > 0" class="text-center mt-8">
          <button class="btn-primary">Load More Stories</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .connect-container {
      background: linear-gradient(135deg, #fdf8f6 0%, #ffffff 50%, #f0f9ff 100%);
    }

    .older-generation-theme {
      background: linear-gradient(135deg, #fdf8f6 0%, #fce7e0 100%);
      border: 2px solid #d85c3f;
    }

    .younger-generation-theme {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 2px solid #0ea5e9;
    }

    .flashcard {
      perspective: 1000px;
      min-height: 300px;
    }

    .flashcard-inner {
      position: relative;
      width: 100%;
      height: 100%;
      text-align: center;
      transition: transform 0.6s;
      transform-style: preserve-3d;
    }

    .flashcard.flipped .flashcard-inner {
      transform: rotateY(180deg);
    }

    .backface-hidden {
      backface-visibility: hidden;
    }

    .rotate-y-180 {
      transform: rotateY(180deg);
    }

    .arrows-container {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .font-display {
      font-family: 'Playfair Display', serif;
    }
  `]
})
export class ConnectGenerationsComponent implements OnInit, OnDestroy, AfterViewInit {
  posts: Post[] = [];
  isLoading = false;
  currentUser: any = { username: 'Guest' };

  private destroy$ = new Subject<void>();

  constructor(
    private postsService: PostsService,
    private gsapService: GSAPService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGenerationPosts();
  }

  ngAfterViewInit(): void {
    this.animateEntry();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadGenerationPosts(): void {
    this.isLoading = true;
    this.postsService.getGenerationConnection()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.success) {
            this.posts = response.posts;
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Error loading generation posts:', error);
        }
      });
  }

  flipCard(event: Event): void {
    const card = (event.target as Element).closest('.flashcard');
    if (card) {
      card.classList.toggle('flipped');

      // Add flip animation
      const flashcardInner = card.querySelector('.flashcard-inner');
      if (flashcardInner) {
        this.gsapService.animate(flashcardInner, {
          duration: 0.6,
          rotationY: card.classList.contains('flipped') ? 180 : 0,
          ease: 'power2.inOut'
        });
      }
    }
  }

  getInitials(username: string | undefined): string {
    if (!username) return 'U';
    return username.substring(0, 2).toUpperCase();
  }

  trackByPostId(index: number, post: Post): string {
    return post.id;
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  createPost(): void {
    this.router.navigate(['/create-post']);
  }

  private animateEntry(): void {
    // Animate header
    this.gsapService.animateFrom('header', {
      duration: 0.8,
      y: -50,
      opacity: 0,
      ease: 'power2.out'
    });

    // Animate generation sides
    this.gsapService.animateFrom('.older-side', {
      duration: 0.8,
      x: -100,
      opacity: 0,
      ease: 'power2.out'
    });

    this.gsapService.animateFrom('.younger-side', {
      duration: 0.8,
      x: 100,
      opacity: 0,
      ease: 'power2.out'
    });

    // Animate arrows
    this.gsapService.animateFrom('.arrows-container', {
      duration: 1,
      scale: 0,
      opacity: 0,
      delay: 0.5,
      ease: 'back.out(1.7)'
    });

    // Animate flashcards
    this.gsapService.staggerAnimation('.flashcard', {
      duration: 0.6,
      y: 50,
      opacity: 0,
      delay: 1,
      stagger: 0.1,
      ease: 'power2.out'
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    // Animate flashcards on scroll
    const flashcards = document.querySelectorAll('.flashcard');
    flashcards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8) {
        this.gsapService.animate(card, {
          duration: 0.6,
          y: 0,
          opacity: 1,
          delay: index * 0.1,
          ease: 'power2.out'
        });
      }
    });
  }
}
