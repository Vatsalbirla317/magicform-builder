# 🔧 Dynamic Form Builder

A powerful, interactive form builder application built with modern web technologies. Create dynamic forms with advanced validation, derived fields, and real-time preview capabilities.

## ✨ Features

- **Dynamic Form Creation** (`/create`): Add various field types (Text, Number, Date, Select, Radio, Checkbox, Textarea, Derived)
- **Live Preview** (`/preview`): Real-time form rendering with live validation and derived field calculations  
- **Form Management** (`/myforms`): Save, edit, and organize forms with localStorage persistence
- **Advanced Validation**: Required fields, min/max length, email, password strength, custom regex
- **Derived Fields**: Formula-based fields that calculate values from other fields (e.g., age from birthdate)
- **Modern UI**: Beautiful Material Design interface with smooth animations

## 🚀 Tech Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for components
- **Redux Toolkit** for state management
- **React Router** for navigation
- **localStorage** for data persistence
- **Vite** for fast development

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd dynamic-form-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout.tsx       # App layout with navigation
│   ├── FieldBuilder.tsx # Form field creation dialog
│   └── FormRenderer.tsx # Form display and interaction
├── pages/               # Route pages
│   ├── Index.tsx        # Home page
│   ├── CreateForm.tsx   # Form builder interface
│   ├── PreviewForm.tsx  # Form preview and testing
│   └── MyForms.tsx      # Saved forms management
├── store/               # Redux state management
│   ├── index.ts         # Store configuration
│   └── slices/          # Redux slices
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
│   ├── localStorage.ts  # Data persistence
│   ├── validation.ts    # Form validation logic
│   └── derivedFields.ts # Formula evaluation
└── index.css           # Design system and styles
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically with these settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Netlify

1. Push your code to GitHub
2. Connect your repository to [Netlify](https://netlify.com)
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

### Manual Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy the 'dist' folder to your hosting provider
```

## 🎯 Usage

1. **Create Forms**: Navigate to `/create` and start building forms with various field types
2. **Add Validations**: Configure field validation rules (required, email, password strength, etc.)
3. **Derived Fields**: Create calculated fields using formulas like `age(birthDate)` or `sum(field1, field2)`
4. **Preview & Test**: Use `/preview` to test your forms with live validation
5. **Manage Forms**: View and organize all saved forms in `/myforms`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📝 Form Field Types

- **Text**: Single-line text input
- **Number**: Numeric input with min/max validation
- **Date**: Date picker with validation
- **Select**: Dropdown with custom options
- **Radio**: Single selection from options
- **Checkbox**: Multiple selection from options  
- **Textarea**: Multi-line text input
- **Derived**: Calculated fields using formulas

## 🧮 Formula Examples

- `age(birthDate)` - Calculate age from birth date
- `sum(field1, field2)` - Add numeric fields
- `avg(field1, field2, field3)` - Average of fields

## 📱 Responsive Design

Fully responsive design that works perfectly on:
- Desktop computers
- Tablets
- Mobile phones

---

Built with ❤️ using React, TypeScript, and Material-UI