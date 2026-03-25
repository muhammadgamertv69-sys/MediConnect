# MediConnect Visual Design Guide

## Design Philosophy

**Trust & Clarity**: Clean, professional aesthetic that instills confidence in healthcare services. Every element serves a functional purpose while maintaining visual harmony.

**Accessibility First**: Designed for users of all ages and technical abilities, with particular attention to mobile-first responsive design.

**Modern Healthcare**: Contemporary design language that feels approachable yet professional, avoiding clinical sterility while maintaining medical credibility.

## Color Palette

### Primary Colors
- **Healthcare Blue**: #007BFF (Primary actions, links, CTAs)
- **Success Green**: #28A745 (Confirmations, success states, availability)

### Supporting Colors
- **Neutral Gray**: #6C757D (Secondary text, borders)
- **Light Gray**: #F8F9FA (Backgrounds, cards)
- **White**: #FFFFFF (Primary background, cards)
- **Error Red**: #DC3545 (Error states, unavailable slots)

### Usage Guidelines
- Blue for all primary actions and navigation
- Green for positive feedback and available appointments
- Maintain 4.5:1 contrast ratio minimum
- No pure colors - all colors have slight saturation for warmth

## Typography

### Primary Font: Inter
- **Base Size**: 16px for body text
- **Headings**: Poppins for display text
- **Line Height**: 1.6 for readability
- **Letter Spacing**: -0.02em for headings, 0 for body

### Type Scale
- **H1**: 2.5rem (40px) - Page titles
- **H2**: 2rem (32px) - Section headers
- **H3**: 1.5rem (24px) - Subsections
- **H4**: 1.25rem (20px) - Card titles
- **Body**: 1rem (16px) - Main content
- **Small**: 0.875rem (14px) - Captions, metadata

## Visual Language

### Layout Principles
- **8-point grid system**: All spacing in multiples of 8px
- **Container max-width**: 1200px centered
- **Mobile padding**: 16px horizontal
- **Desktop padding**: 24px horizontal

### Component Styling
- **Border radius**: 8px for cards, 4px for buttons
- **Shadows**: Subtle elevation with rgba(0,0,0,0.1)
- **Borders**: 1px solid rgba(0,0,0,0.1)

### Iconography
- **Style**: Rounded line icons
- **Size**: 24px standard, 32px for primary actions
- **Color**: Inherit from parent or use primary blue

## Visual Effects

### Animation Library Usage
- **Anime.js**: Smooth transitions for state changes
- **Typed.js**: Typewriter effect for hero headlines
- **ECharts.js**: Interactive charts for admin dashboard
- **Splide**: Image carousels for doctor profiles

### Effect Implementation
- **Page transitions**: Fade with 300ms duration
- **Button hover**: Subtle scale (1.02) with shadow increase
- **Card hover**: Lift effect with shadow animation
- **Loading states**: Skeleton screens with shimmer effect

### Header Background Effect
- **Aurora gradient flow**: Subtle animated gradient using CSS
- **Colors**: Soft blue to green transition
- **Movement**: Slow, continuous flow (60s duration)

## Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile Optimizations
- **Touch targets**: Minimum 44px × 44px
- **Font scaling**: Responsive typography
- **Navigation**: Bottom tab bar for primary actions
- **Forms**: Single column layout with large inputs

## Component Specifications

### Buttons
- **Primary**: Blue background, white text, 8px radius
- **Secondary**: White background, blue border and text
- **Success**: Green background for confirmations
- **Padding**: 12px vertical, 24px horizontal

### Cards
- **Background**: White with subtle shadow
- **Padding**: 24px
- **Border radius**: 8px
- **Hover**: Lift effect with increased shadow

### Forms
- **Input height**: 48px minimum
- **Labels**: Above inputs, 14px, medium weight
- **Validation**: Inline error messages in red
- **Focus states**: Blue border with subtle glow

This design system ensures consistency across all pages while maintaining the professional, trustworthy aesthetic required for healthcare applications.