# CarbonWise: Your Carbon Footprint Tracker 🌍💚

[![Latest Release](https://img.shields.io/github/v/release/nbahaedin/CarbonWise-Carbon-Tracker?style=flat-square)](https://github.com/nbahaedin/CarbonWise-Carbon-Tracker/releases)

![CarbonWise Logo](https://example.com/logo.png)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Routes](#api-routes)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

CarbonWise is a comprehensive web application designed to help individuals track, analyze, and reduce their carbon footprint. By using intelligent activity logging, users can set personal goals and engage with a community focused on sustainability. The application provides valuable insights into daily activities and their environmental impact, making it easier to adopt eco-friendly habits.

## Features

- **Activity Logging**: Record daily activities and their carbon impact.
- **Goal Setting**: Set personal sustainability goals and track progress.
- **Community Engagement**: Connect with others who share similar goals.
- **Data Visualization**: Analyze data with interactive charts and graphs.
- **Responsive Design**: Access the application on any device.
- **User Authentication**: Secure login and user management with Supabase.
- **Customizable Dashboard**: Personalize your experience with widgets.

## Technologies Used

- **Frontend**: 
  - Next.js 14
  - React Hooks
  - Tailwind CSS
  - Shadcn UI
  - Recharts
  - TypeScript

- **Backend**: 
  - PostgreSQL
  - Supabase for authentication and database management

- **Deployment**: 
  - Vercel for hosting

## Installation

To get started with CarbonWise, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/nbahaedin/CarbonWise-Carbon-Tracker.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd CarbonWise-Carbon-Tracker
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Set up environment variables**:

   Create a `.env.local` file in the root directory and add your Supabase credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the application**:

   ```bash
   npm run dev
   ```

   Open your browser and go to `http://localhost:3000`.

## Usage

Once the application is running, you can create an account or log in if you already have one. Start logging your activities and setting goals. The dashboard will display your progress and provide insights into your carbon footprint.

## API Routes

CarbonWise uses a set of API routes to manage user data and activities. Below are the main routes:

- **POST /api/auth/signup**: Create a new user account.
- **POST /api/auth/login**: Log in to an existing account.
- **GET /api/activities**: Retrieve logged activities for the user.
- **POST /api/activities**: Log a new activity.
- **GET /api/goals**: Retrieve user goals.
- **POST /api/goals**: Set a new sustainability goal.

## Contributing

We welcome contributions to CarbonWise. If you would like to help, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your branch to your forked repository.
5. Create a pull request.

Please ensure that your code adheres to the project's coding standards.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please reach out:

- **Author**: N. Bahaedin
- **Email**: nbahaedin@example.com
- **GitHub**: [nbahaedin](https://github.com/nbahaedin)

For the latest releases, visit [here](https://github.com/nbahaedin/CarbonWise-Carbon-Tracker/releases).

![Carbon Tracker](https://example.com/carbon-tracker.png)

### Join Us in Making a Difference! 🌱

CarbonWise aims to empower individuals to take action against climate change. By tracking your carbon footprint, you can make informed choices and inspire others in your community. Start your journey today!

For more updates, check the [Releases](https://github.com/nbahaedin/CarbonWise-Carbon-Tracker/releases) section.