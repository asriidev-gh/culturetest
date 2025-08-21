# Culture Test App

A modern behavioral and cultural assessment creation platform built with Next.js, React, and Tailwind CSS.

## Features

### 🎯 Test Creation
- **Test Definition**: Create tests with descriptive names and behavioral descriptions
- **Question Builder**: Add custom questions with tags and scoring options
- **Flexible Scoring**: Configure answer options with positive/negative scoring

### 📊 Question Management
- **Question Tags**: Categorize questions (e.g., "Ownership & Accountability")
- **Custom Options**: Set up 4-option questions with configurable scores
- **Dynamic Addition**: Add/remove questions as needed

### 🔗 Test Sharing
- **Shareable Links**: Generate unique test URLs for candidates
- **Multiple Sharing Options**: Copy link, email, or social media sharing
- **Analytics Dashboard**: Track views, starts, submissions, and completion rates

### 📈 Results & Insights
- **Performance Metrics**: Score, percentage, and ranking system
- **Category Breakdown**: Detailed analysis by behavioral categories
- **Actionable Insights**: Identify strengths and development areas

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React
- **State Management**: React useState for local state
- **Responsive Design**: Mobile-first approach

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd culture-test-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
culture-test-app/
├── app/                    # Next.js app directory
│   ├── layout.jsx         # Root layout
│   ├── page.jsx           # Main page with step management
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── Header.jsx         # App header
│   ├── TestCreation.jsx   # Step 1: Test definition
│   ├── TestQuestions.jsx  # Step 2: Question creation
│   ├── TestShare.jsx      # Step 3: Test sharing
│   └── TestResults.jsx    # Step 4: Results & insights
├── public/                 # Static assets
├── package.json            # Dependencies & scripts
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

## Usage Flow

1. **Define Test**: Enter test name and describe desired behaviors
2. **Create Questions**: Add questions with tags and scoring options
3. **Share Test**: Get shareable link and track analytics
4. **View Results**: Analyze candidate performance and insights

## Customization

### Adding New Question Types
Extend the `TestQuestions` component to support different question formats.

### Custom Scoring
Modify the scoring system in the question options and results calculation.

### Additional Analytics
Enhance the analytics dashboard with more metrics and visualizations.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue in the repository.


