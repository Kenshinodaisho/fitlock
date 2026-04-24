// ============================================================================
// FITLOCK iOS APP - COMPLETE SWIFTUI CODE
// ============================================================================
// Setup:
// 1. Open Xcode → Create New Project → iOS → App → SwiftUI
// 2. Name it "FitLock"
// 3. Split this file into separate Swift files per "// FILE:" section
// 4. Add camera permissions to Info.plist
// ============================================================================

// FILE: FitLockApp.swift
import SwiftUI

@main
struct FitLockApp: App {
    @StateObject private var userStore = UserStore()
    
    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(userStore)
        }
    }
}

// FILE: UserStore.swift
import SwiftUI

class UserStore: ObservableObject {
    @Published var currentScreen: AppScreen = .splash
    @Published var onboardingStep: Int = 0
    @Published var totalPushups: Int = 147
    @Published var earnedMinutes: Int = 23
    @Published var streak: Int = 7
    @Published var profileName: String = "Champion"
    @Published var profileAvatar: String = "💪"
    @Published var profileLevel: Int = 7
    @Published var profileXP: Int = 2340
    
    var calculatedCalories: Int {
        Int(Double(totalPushups) * 0.32)
    }
}

enum AppScreen {
    case splash, onboarding, main
}

// FILE: RootView.swift
import SwiftUI

struct RootView: View {
    @EnvironmentObject var userStore: UserStore
    
    var body: some View {
        Group {
            switch userStore.currentScreen {
            case .splash: SplashView()
            case .onboarding: OnboardingView()
            case .main: MainTabView()
            }
        }
    }
}

// FILE: SplashView.swift
import SwiftUI

struct SplashView: View {
    @EnvironmentObject var userStore: UserStore
    
    var body: some View {
        ZStack {
            LinearGradient(colors: [.orange, .red, .pink],
                          startPoint: .topLeading, endPoint: .bottomTrailing)
                .ignoresSafeArea()
            
            VStack(spacing: 16) {
                Image(systemName: "dumbbell.fill")
                    .font(.system(size: 50))
                    .foregroundColor(.white)
                    .padding(30)
                    .background(Color.white.opacity(0.2))
                    .cornerRadius(28)
                
                Text("FitLock")
                    .font(.system(size: 48, weight: .black))
                    .foregroundColor(.white)
                
                Text("SWEAT TO SCROLL")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.white.opacity(0.9))
                    .tracking(3)
            }
        }
        .onAppear {
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                userStore.currentScreen = .onboarding
            }
        }
    }
}

// FILE: OnboardingView.swift
import SwiftUI

struct OnboardingView: View {
    @EnvironmentObject var userStore: UserStore
    
    var body: some View {
        VStack {
            Text("Welcome to FitLock")
                .font(.largeTitle.bold())
            
            Text("Exercise to unlock your phone")
                .padding()
            
            Button("Get Started") {
                userStore.currentScreen = .main
            }
            .padding()
            .background(Color.orange)
            .foregroundColor(.white)
            .cornerRadius(12)
        }
    }
}

// FILE: MainTabView.swift
import SwiftUI

struct MainTabView: View {
    var body: some View {
        TabView {
            HomeView()
                .tabItem { Label("Home", systemImage: "house.fill") }
            
            StatsView()
                .tabItem { Label("Stats", systemImage: "chart.bar.fill") }
            
            SquadView()
                .tabItem { Label("Squad", systemImage: "person.3.fill") }
            
            ProfileView()
                .tabItem { Label("Profile", systemImage: "person.fill") }
        }
        .tint(.orange)
    }
}

// FILE: HomeView.swift
import SwiftUI

struct HomeView: View {
    @EnvironmentObject var userStore: UserStore
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    Text("🔥 \(userStore.streak) day streak")
                        .font(.title.bold())
                    
                    HStack {
                        StatCard(icon: "figure.strengthtraining.traditional",
                                label: "PUSHUPS", value: "\(userStore.totalPushups)")
                        StatCard(icon: "clock.fill",
                                label: "EARNED", value: "\(userStore.earnedMinutes) min")
                    }
                    
                    Text("Your Apps")
                        .font(.title2.bold())
                        .frame(maxWidth: .infinity, alignment: .leading)
                    
                    // Add blocked apps list here
                }
                .padding()
            }
            .navigationTitle("FitLock")
        }
    }
}

struct StatCard: View {
    let icon: String
    let label: String
    let value: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Image(systemName: icon)
                .foregroundColor(.orange)
            Text(label)
                .font(.caption.bold())
            Text(value)
                .font(.title.bold())
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(Color.gray.opacity(0.1))
        .cornerRadius(16)
    }
}

// FILE: StatsView.swift
import SwiftUI

struct StatsView: View {
    @EnvironmentObject var userStore: UserStore
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack {
                    Text("Your Progress")
                        .font(.title.bold())
                    
                    Text("42.5 hrs saved this month")
                        .font(.title2)
                    
                    Text("\(userStore.calculatedCalories) calories burned 🔥")
                }
                .padding()
            }
        }
    }
}

// FILE: SquadView.swift
import SwiftUI

struct SquadView: View {
    var body: some View {
        NavigationStack {
            VStack {
                Text("Your Squad")
                    .font(.title.bold())
                Text("Coming soon...")
            }
            .padding()
        }
    }
}

// FILE: ProfileView.swift
import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var userStore: UserStore
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                Text(userStore.profileAvatar)
                    .font(.system(size: 80))
                
                Text(userStore.profileName)
                    .font(.title.bold())
                
                Text("Level \(userStore.profileLevel) · \(userStore.profileXP) XP")
                    .foregroundColor(.secondary)
            }
            .padding()
        }
    }
}

// ============================================================================
// POSE DETECTION (Advanced - Add Later)
// ============================================================================
/*
import Vision
import AVFoundation

class PoseDetector: NSObject, ObservableObject {
    @Published var repCount: Int = 0
    private var poseState: PoseState = .ready
    
    enum PoseState { case ready, up, down }
    
    func processFrame(_ pixelBuffer: CVPixelBuffer) {
        let request = VNDetectHumanBodyPoseRequest { [weak self] req, _ in
            guard let observations = req.results as? [VNHumanBodyPoseObservation],
                  let first = observations.first else { return }
            self?.analyzePose(first)
        }
        let handler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer)
        try? handler.perform([request])
    }
    
    private func analyzePose(_ observation: VNHumanBodyPoseObservation) {
        // Get shoulder, elbow, wrist keypoints
        // Calculate elbow angle
        // Count reps when angle transitions from bent to straight
    }
}
*/

// ============================================================================
// INFO.PLIST PERMISSIONS
// ============================================================================
/*
NSCameraUsageDescription: "FitLock uses camera to count reps"
NSPhotoLibraryUsageDescription: "FitLock needs photos for profile picture"
*/
