# MC-Chat

MC-Chat is a messaging platform designed for Manhattan College, facilitating secure and versatile communication channels for students and faculty members. Built with React Native and leveraging Firebase for real-time data synchronization and authentication, MC-Chat offers a multitude of features, bringing a full package chatting application for all users across iOS, Android, and web platforms.

## Key Features

### Secure Registration and Authentication
- **Official Email Registration:** Sign up exclusively with Manhattan College email addresses.
- **Streamlined Login Process:** Access the system with your registered email and password.
- **Password Recovery:** Utilize the 'Forgot My Password' feature for secure password resets.

### Comprehensive Profile Management
- **Customizable Profiles:** Add personal details such as Major, Graduation Year, Department, and Title.
- **Communication Preferences:** Opt-in or out of voice messaging and live video/voice chats.
- **Profanity Filter:** Enable or disable the profanity filter for personalized communication standards.

### Versatile Messaging Capabilities
- **Private and Group Messaging:** Exchange text and voice messages or engage in private voice and video chats.
- **Administrative Controls:** Create chat rooms with robust permissions and appoint moderators or co-administrators.
- **Media Sharing:** Share files, images, voice messages, and emojis across formats.

### User Directory and Social Features
- **Accessible User Directory:** Browse a list of verified users, with options to block or friend for personalized interaction.
- **Friend Requests:** Manage incoming friend requests, fostering a connected community.

### Advanced Content Moderation
- **User Blocking and Reporting:** Block users and report inappropriate content to maintain a safe environment.
- **Automatic Content Review:** Content flagged by multiple users is obscured pending administrative review.

### AI-Assisted Messaging
- **Smart Reply Suggestions:** Utilize AI-generated responses for efficient communication.

### Real-Time Notifications
- **Stay Updated:** Receive instant notifications for messages, friend requests, and other alerts.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js
- npm or Yarn
- Expo CLI

### Installation

1. Clone the repository:
git clone https://github.com/hsallaku/mc-chat.git

2. Navigate to the project directory:
cd mc-chat

3. Install dependencies:
npm install

or if you're using Yarn:
yarn install

### Running the App

To start the development server and run the app:
npx expo start

You can then open the app using the Expo app which will require you to either enter the generated URL or you could simply scan the QR code generated in the terminal. Alternatively you could use an emulator.

## Project Structure

- `/assets`: Contains image assets and stylesheets.
- `/components`: Reusable components used throughout the app.
- `/logic`: Business logic and context providers.
- `/navigators`: Navigation setup for the app.
- `/screens`: Individual screens of the app.

## Contributors

Special thanks to the amazing people who have contributed to this project:

- Gary LaPicola
- Thomas Scardino
- Louie Celliberti

Their contributions have been invaluable to the development and success of MC-Chat.

## License

This project is licensed under the MIT License.
