# ECESTORMS Website

This is the official website for ECESTORMS.

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ecestorms-website.git
cd ecestorms-website
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Update the admin credentials in `.env.local`

```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

The website includes an admin panel for content management. To access it:

1. Click the small dot in the footer
2. Enter the admin credentials (set in your `.env.local` file)
3. You'll be redirected to the admin dashboard

## Environment Variables

The following environment variables are required:

- `ADMIN_USERNAME`: Admin username
- `ADMIN_PASSWORD`: Admin password
- `AWS_REGION`: AWS region for S3 bucket
- `AWS_ACCESS_KEY_ID`: AWS access key ID
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key
- `AWS_BUCKET_NAME`: AWS S3 bucket name
- `JWT_KEY`: JWT key name

## Deployment

The website can be deployed to any platform that supports Next.js, such as Vercel, Netlify, or a custom server. Ensure that the environment variables are set correctly in your deployment environment.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
