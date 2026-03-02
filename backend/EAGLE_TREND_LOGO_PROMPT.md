# Eagle Trend Logo Design Prompt

## For AI Image Generators (DALL-E, Midjourney, Stable Diffusion)

### Primary Prompt
```
Create a professional, modern logo for "Eagle Trend" - a financial technology company specializing in loan management systems. The logo should feature:

- A stylized eagle silhouette in flight, representing vision, strength, and financial growth
- Clean, minimalist design with sharp, geometric lines
- Color scheme: Deep navy blue (#1a365d) and gold/amber (#f59e0b) accents
- The eagle should be integrated with an upward trending arrow or graph line
- Modern, sans-serif typography for "EAGLE TREND" text
- Professional, trustworthy appearance suitable for financial services
- Scalable design that works well in both large and small sizes
- Flat design style with subtle gradients

Style: Corporate, modern, fintech, minimalist, professional
Format: Vector-style, clean lines, suitable for digital and print
Mood: Trustworthy, innovative, powerful, forward-thinking
```

### Alternative Prompt (Simplified)
```
Modern minimalist logo: stylized eagle with upward arrow, navy blue and gold colors, "EAGLE TREND" text, professional fintech style, clean geometric design
```

### Detailed Specifications

#### Color Palette
- **Primary**: Navy Blue (#1a365d) - Trust, stability, professionalism
- **Secondary**: Gold/Amber (#f59e0b) - Growth, prosperity, premium quality
- **Accent**: Light Gray (#e5e7eb) - Modern, clean
- **Text**: Dark Gray (#1f2937) or Navy Blue

#### Typography Suggestions
- **Primary Font**: Inter, Poppins, or Montserrat (Bold/SemiBold)
- **Style**: Sans-serif, modern, geometric
- **Weight**: 600-700 for "EAGLE", 400-500 for "TREND"

#### Design Elements
1. **Eagle Symbol**
   - Abstract/geometric interpretation
   - Wings spread in upward motion
   - Can be combined with financial symbols (arrow, graph, currency)
   - Should work as standalone icon

2. **Trend Element**
   - Upward trending line/arrow
   - Can be integrated into eagle wings
   - Represents growth and financial success

3. **Layout Options**
   - Horizontal: Eagle icon + "EAGLE TREND" text side by side
   - Stacked: Eagle icon above "EAGLE TREND" text
   - Integrated: Eagle and text as one unified design

#### Use Cases
- Website header/favicon
- Mobile app icon
- Business cards
- Email signatures
- Marketing materials
- Login screens
- PDF reports

### Midjourney Specific Prompt
```
eagle logo for fintech company, minimalist geometric design, navy blue and gold color scheme, upward trending arrow integrated with eagle wings, modern corporate style, vector art, clean lines, professional financial services branding, "EAGLE TREND" typography --v 6 --style raw --s 250
```

### DALL-E Specific Prompt
```
A professional logo design for "Eagle Trend" financial technology company. Features a minimalist, geometric eagle in flight with wings forming an upward trending arrow. Color scheme: navy blue (#1a365d) and gold (#f59e0b). Modern sans-serif typography. Clean, corporate style suitable for a loan management platform. Vector-style illustration with flat design and subtle gradients.
```

### Stable Diffusion Specific Prompt
```
professional logo design, eagle silhouette, upward arrow trend, navy blue and gold colors, minimalist geometric style, fintech branding, "EAGLE TREND" text, corporate identity, vector art, clean lines, financial services, modern typography, flat design, high quality, 4k
Negative prompt: realistic, photographic, cluttered, complex, cartoon, childish, 3d render
```

## Design Variations to Generate

1. **Icon Only** - Just the eagle symbol for app icons
2. **Full Logo** - Eagle + complete text
3. **Horizontal Layout** - For website headers
4. **Stacked Layout** - For square spaces
5. **Monochrome Version** - For single-color applications
6. **Inverted Version** - Light colors on dark background

## File Formats Needed

- **SVG** - Scalable vector (primary format)
- **PNG** - Transparent background (1024x1024, 512x512, 256x256)
- **ICO** - Favicon (32x32, 16x16)
- **PDF** - Print quality

## Brand Guidelines

### Logo Usage
- Minimum size: 120px width for full logo
- Clear space: Minimum 20px around logo
- Don't stretch, rotate, or distort
- Don't change colors without approval
- Don't add effects (shadows, outlines, etc.)

### Color Usage
```css
/* Primary Colors */
--eagle-navy: #1a365d;
--eagle-gold: #f59e0b;

/* Supporting Colors */
--eagle-light-gray: #e5e7eb;
--eagle-dark-gray: #1f2937;
--eagle-white: #ffffff;

/* Gradients */
--eagle-gradient: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
--gold-gradient: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
```

## Implementation in Application

Once logo is generated, update these files:

1. **Frontend**
   - `/public/logo.svg` - Main logo
   - `/public/favicon.ico` - Browser icon
   - `/src/assets/logo.png` - Various sizes

2. **Backend**
   - `/backend/static/logo.svg` - For admin panel
   - `/backend/media/branding/` - Email templates

3. **Documentation**
   - README.md header
   - API documentation
   - User guides

## Quick Start Commands

After generating logo files:

```bash
# Create branding directory
mkdir -p backend/static/branding
mkdir -p frontend/public/branding

# Copy logo files
cp eagle-trend-logo.svg backend/static/branding/logo.svg
cp eagle-trend-icon.png frontend/public/favicon.png
cp eagle-trend-logo.svg frontend/src/assets/logo.svg
```

## References & Inspiration

- **Financial Logos**: Stripe, Square, PayPal (modern, clean)
- **Eagle Logos**: American Express, USPS (strong, trustworthy)
- **Fintech Style**: Revolut, N26, Chime (minimalist, tech-forward)

---

**Note**: After generating the logo, ensure it's tested across different backgrounds (white, dark, colored) and at various sizes to confirm readability and visual impact.
