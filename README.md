<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# JuraganKos 2.0 - Modern Boarding House Marketplace 🏠☁️

JuraganKos 2.0 is a modern, cloud-native B2C marketplace platform designed to revolutionize how students and young professionals find, verify, and book boarding houses (*indekos*) in Indonesia.

Transitioning from a traditional SaaS model, version 2.0 serves as a **Two-Sided Marketplace**, connecting property seekers (Demand) with property owners (Supply) through a seamless, blazing-fast, and secure digital ecosystem.

## ✨ Key Features

* **Smart Search & Filtering:** Lightning-fast property discovery with advanced filters (price, location, facilities).  
* **Verified Listings:** High-quality, cloud-hosted images and verified property details to prevent scams.  
* **Direct Booking & Secure Escrow:** Integrated payment gateway for secure Down Payment (DP) transactions, acting as a trusted middleman.  
* **Real-time Availability:** Powered by cloud databases to synchronize room availability instantly—if a room is booked, it updates everywhere without a page refresh.  
* **SEO-Optimized Pages:** Utilizing Server-Side Rendering (SSR) to ensure maximum visibility on search engines, reducing organic Customer Acquisition Cost (CAC).

## 🛠️ Cloud Architecture & Tech Stack

This project is built with modern cloud computing principles in mind, ensuring high scalability and availability:

* **Framework:** [Next.js](https://nextjs.org/) (App Router)  
* **Backend as a Service (BaaS):** [Supabase](https://supabase.com/)  
  * *PostgreSQL* for robust relational data.  
  * *Supabase Storage* for handling thousands of property images.  
  * *Supabase Auth* for secure user management.  
* **Styling:** Tailwind CSS  
* **Deployment & Edge Network:** Vercel (Optimized for Edge Computing)

## 🚀 Getting Started (Local Development)

To run this Next.js project locally on your machine:

1. **Clone the repository:**  
   `git clone https://github.com/kelfinjonio12-sudo/JuraganKos-2.0.git` 
   `cd JuraganKos-2.0`

2. **Install dependencies:**  
   `npm install`

3. **Set up Environment Variables:**  
   Create a .env.local file in the root directory and add your Supabase credentials:  
   `NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url`
   `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`

4. **Run the development server:**  
   `npm run dev`

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ae81d538-7e76-4aff-b7cc-356e247b32c5

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

*Developed as a Cloud Computing final project. Built with ❤️ in Indonesia.*