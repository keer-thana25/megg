import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, User } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { GSAPService } from '../../services/gsap.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="edit-profile-container min-h-screen bg-gray-50">
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
                <a routerLink="/profile" class="text-chronolink-primary font-medium">Profile</a>
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
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h2>
          <p class="text-gray-600 mb-8">Update your profile information and interests</p>

          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Bio Field -->
            <div class="form-group">
              <label for="bio" class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                id="bio"
                formControlName="bio"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chronolink-primary focus:border-transparent transition-all duration-200"
                placeholder="Tell us about yourself..."></textarea>
              <div *ngIf="profileForm.get('bio')?.invalid && profileForm.get('bio')?.touched" class="text-red-500 text-sm mt-1">
                Bio is required
              </div>
            </div>

            <!-- Interests Field -->
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-2">Interests</label>
              <div class="space-y-2">
                <div class="flex flex-wrap gap-2 mb-3">
                  <span *ngFor="let interest of selectedInterests; let i = index"
                        class="inline-flex items-center px-3 py-1 bg-chronolink-primary bg-opacity-10 text-chronolink-primary rounded-full text-sm">
                    {{ interest }}
                    <button type="button" (click)="removeInterest(i)" class="ml-2 text-chronolink-primary hover:text-red-500">
                      <i class="fas fa-times"></i>
                    </button>
                  </span>
                </div>
                <div class="flex gap-2">
                  <select
                    #interestSelect
                    class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chronolink-primary focus:border-transparent transition-all duration-200">
                    <option value="">Select an interest</option>
                    <option value="Spirituality">Spirituality</option>
                    <option value="Literature">Literature</option>
                    <option value="Art">Art</option>
                    <option value="Heritage">Heritage</option>
                    <option value="Inspiration">Inspiration</option>
                    <option value="Technology">Technology</option>
                    <option value="Music">Music</option>
                    <option value="History">History</option>
                  </select>
                  <button
                    type="button"
                    (click)="addInterest(interestSelect.value)"
                    class="px-4 py-3 bg-chronolink-primary text-white rounded-lg hover:bg-opacity-90 transition-colors duration-200">
                    Add
                  </button>
                </div>
              </div>
            </div>

            <!-- Achievements Field -->
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
              <div class="space-y-2">
                <div class="flex flex-wrap gap-2 mb-3">
                  <span *ngFor="let achievement of selectedAchievements; let i = index"
                        class="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    <i class="fas fa-trophy mr-1 text-yellow-600"></i>
                    {{ achievement }}
                    <button type="button" (click)="removeAchievement(i)" class="ml-2 text-yellow-600 hover:text-red-500">
                      <i class="fas fa-times"></i>
                    </button>
                  </span>
                </div>
                <div class="flex gap-2">
                  <input
                    type="text"
                    #achievementInput
                    class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chronolink-primary focus:border-transparent transition-all duration-200"
                    placeholder="Enter an achievement">
                  <button
                    type="button"
                    (click)="addAchievement(achievementInput.value)"
                    class="px-4 py-3 bg-chronolink-primary text-white rounded-lg hover:bg-opacity-90 transition-colors duration-200">
                    Add
                  </button>
                </div>
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
                [disabled]="profileForm.invalid || isLoading"
                class="px-8 py-3 bg-chronolink-primary text-white rounded-lg font-medium transition-all duration-200 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                <span *ngIf="isLoading" class="inline-flex items-center">
                  <div class="spinner mr-2"></div>
                  Updating Profile...
                </span>
                <span *ngIf="!isLoading">Update Profile</span>
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
    .edit-profile-container {
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
export class EditProfileComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  currentUser: User | null = null;
  selectedInterests: string[] = [];
  selectedAchievements: string[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usersService: UsersService,
    private gsapService: GSAPService,
    private router: Router
  ) {
    this.profileForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.animateEntry();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCurrentUser(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: any) => {
        this.currentUser = user;
        if (user) {
          this.selectedInterests = user.interests || [];
          this.selectedAchievements = user.achievements || [];
          this.profileForm.patchValue({
            bio: user.bio || ''
          });
        }
      });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      bio: ['', [Validators.required]]
    });
  }

  addInterest(interest: string): void {
    if (interest && !this.selectedInterests.includes(interest)) {
      this.selectedInterests.push(interest);
    }
  }

  removeInterest(index: number): void {
    this.selectedInterests.splice(index, 1);
  }

  addAchievement(achievement: string): void {
    if (achievement.trim() && !this.selectedAchievements.includes(achievement.trim())) {
      this.selectedAchievements.push(achievement.trim());
    }
  }

  removeAchievement(index: number): void {
    this.selectedAchievements.splice(index, 1);
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const profileData = {
      bio: this.profileForm.value.bio,
      interests: this.selectedInterests,
      achievements: this.selectedAchievements
    };

    this.usersService.updateProfile(profileData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'Profile updated successfully!';
            // Update the current user in auth service
            this.authService.refreshCurrentUser();
            setTimeout(() => {
              this.router.navigate(['/profile']);
            }, 2000);
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to update profile';
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/profile']);
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
