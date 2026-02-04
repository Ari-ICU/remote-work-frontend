import { Job } from "@/types/job";

export const jobs: Job[] = [
    {
        id: 1,
        title: "Senior Frontend Developer",
        company: "TechCambodia",
        location: "Remote (Global)",
        type: "Remote Full-time",
        salary: "$2,000 - $3,500/mo",
        posted: "2 days ago",
        tags: ["React", "TypeScript", "Next.js", "Remote"],
        featured: true,
        category: "Development",
        description: "We are looking for a Senior Frontend Developer to join our remote team. You will responsible for building high-quality web applications using modern technologies.",
        requirements: [
            "5+ years of experience with React and TypeScript",
            "Strong understanding of Next.js and server-side rendering",
            "Experience with state management (Redux, Zustand, or Context)",
            "Familiarity with Tailwind CSS and modern UI libraries"
        ],
        responsibilities: [
            "Develop and maintain scalable web applications",
            "Collaborate with designers and backend developers",
            "Mentor junior developers and conduct code reviews",
            "Optimize application performance and accessibility"
        ],
    },
    {
        id: 2,
        title: "UI/UX Designer",
        company: "Digital Solutions KH",
        location: "Remote (Phnom Penh Based)",
        type: "Remote Full-time",
        salary: "$1,500 - $2,500/mo",
        posted: "3 days ago",
        tags: ["Figma", "UI Design", "Prototyping", "Remote"],
        featured: true,
        category: "Design",
        description: "We are seeking a talented UI/UX Designer to create intuitive and visually appealing user interfaces for web and mobile applications.",
        requirements: [
            "3+ years of experience in UI/UX design",
            "Proficiency in Figma and Adobe Creative Suite",
            "Strong portfolio showcasing web and mobile design projects",
            "Understanding of user-centered design principles"
        ],
        responsibilities: [
            "Create wireframes, prototypes, and high-fidelity mockups",
            "Conduct user research and usability testing",
            "Collaborate with developers to ensure accurate implementation",
            "Maintain and evolve the company's design system"
        ]
    },
    {
        id: 3,
        title: "Digital Marketing Specialist",
        company: "GrowthLab Cambodia",
        location: "Remote",
        type: "Freelance Contract",
        salary: "$1,200 - $2,000/mo",
        posted: "1 day ago",
        tags: ["SEO", "Google Ads", "Analytics", "Freelance"],
        featured: false,
        category: "Marketing",
        description: "Join our growth team as a Digital Marketing Specialist. You will drive traffic and conversions through various digital channels.",
        requirements: [
            "Proven experience in digital marketing and SEO",
            "Expertise in Google Ads and Facebook Ads Manager",
            "Strong analytical skills and experience with Google Analytics",
            "Excellent written and verbal communication skills"
        ],
        responsibilities: [
            "Plan and execute digital marketing campaigns",
            "Monitor and analyze campaign performance metrics",
            "Optimize website content for search engines",
            "Manage social media accounts and engagement"
        ]
    },
    {
        id: 4,
        title: "Content Writer",
        company: "MediaHouse KH",
        location: "Remote (Siem Reap Based)",
        type: "Freelance Part-time",
        salary: "$800 - $1,200/mo",
        posted: "5 days ago",
        tags: ["Writing", "SEO", "English", "Freelance"],
        featured: false,
        category: "Writing",
        description: "We are looking for a creative Content Writer to produce high-quality articles, blog posts, and marketing copy.",
        requirements: [
            "Excellent writing and editing skills in English",
            "Experience with SEO content creation strategies",
            "Ability to meet tight deadlines",
            "Strong research skills"
        ],
        responsibilities: [
            "Write engaging blog posts, articles, and social media copy",
            "Conduct keyword research to optimize content",
            "Collaborate with the marketing team on content strategy",
            "Proofread and edit content before publication"
        ]
    },
    {
        id: 5,
        title: "Full Stack Developer",
        company: "Startup Ventures",
        location: "Remote (Global)",
        type: "Remote Full-time",
        salary: "$2,500 - $4,000/mo",
        posted: "1 day ago",
        tags: ["Node.js", "React", "PostgreSQL", "Remote"],
        featured: true,
        category: "Development",
        description: "We are hiring a Full Stack Developer to build and maintain our core product. You should be comfortable working on both frontend and backend.",
        requirements: [
            "Experience with Node.js, Express, and React",
            "Strong knowledge of SQL and database design",
            "Experience with RESTful APIs and authentication",
            "Familiarity with cloud platforms like AWS or Vercel"
        ],
        responsibilities: [
            "Design and implement new features across the full stack",
            "Optimize database queries and API performance",
            "Write clean, maintainable, and tested code",
            "Troubleshoot and resolve production issues"
        ]
    },
    {
        id: 6,
        title: "Customer Support Lead",
        company: "E-Commerce Plus",
        location: "Remote (Phnom Penh Based)",
        type: "Remote Full-time",
        salary: "$1,000 - $1,500/mo",
        posted: "4 days ago",
        tags: ["Support", "Khmer", "English", "Remote"],
        featured: false,
        category: "Customer Support",
        description: "Lead our customer support team and ensure exceptional service for our e-commerce platform users.",
        requirements: [
            "Prior experience in a customer support leadership role",
            "Fluent in both Khmer and English",
            "Strong problem-solving and conflict resolution skills",
            "Experience with support ticketing systems (e.g., Zendesk)"
        ],
        responsibilities: [
            "Manage and train a team of support agents",
            "Handle escalated customer inquiries and issues",
            "Monitor support metrics and improve response times",
            "Create and update support documentation and FAQs"
        ]
    },
    {
        id: 7,
        title: "Logo Designer",
        company: "Brandify KH",
        location: "Remote (Global)",
        type: "Freelance",
        salary: "$25 - $45/hr",
        posted: "6 hours ago",
        tags: ["Logo Design", "Illustration", "Branding", "Hourly Rate", "Freelance"],
        featured: false,
        category: "Design",
        description: "We need a creative Logo Designer to help shape the brand identity of our clients.",
        requirements: [
            "Strong portfolio of logo and branding work",
            "Proficiency in Adobe Illustrator",
            "Creativity and attention to detail",
            "Ability to understand and interpret client briefs"
        ],
        responsibilities: [
            "Design unique and memorable logos",
            "Create brand guidelines and visual assets",
            "Iterate on designs based on client feedback",
            "Deliver high-quality vector files"
        ]
    },
    {
        id: 8,
        title: "QA Engineer",
        company: "SoftSquare Cambodia",
        location: "Remote (Hybrid Authorized)",
        type: "Freelance Contract",
        salary: "$15 - $25/hr",
        posted: "1 day ago",
        tags: ["Testing", "Automation", "Jira", "Hourly Rate", "Remote"],
        featured: false,
        category: "Development",
        description: "Ensure the quality of our software products through manual and automated testing.",
        requirements: [
            "Experience with software testing methodologies",
            "Knowledge of automated testing tools (e.g., Selenium, Cypress)",
            "Familiarity with bug tracking systems like Jira",
            "Attention to detail and analytical mindset"
        ],
        responsibilities: [
            "Create and execute test plans and test cases",
            "Identify, record, and track bugs",
            "Collaborate with developers to resolve issues",
            "Perform regression testing before releases"
        ]
    },
    {
        id: 9,
        title: "Khmer-English Translator",
        company: "Global Bridge",
        location: "Remote (Siem Reap Based)",
        type: "Freelance Part-time",
        salary: "$12 - $20/hr",
        posted: "3 days ago",
        tags: ["Translation", "Khmer", "English", "Hourly Rate", "Freelance"],
        featured: false,
        category: "Translation",
        description: "Translate documents and content between Khmer and English with high accuracy.",
        requirements: [
            "Native-level proficiency in Khmer and English",
            "Previous experience in translation or localization",
            "Strong attention to detail and grammar",
            "Ability to meet deadlines"
        ],
        responsibilities: [
            "Translate technical and general documents",
            "Proofread and edit translated content",
            "Ensure cultural appropriateness of translations",
            "Maintain terminology glossaries"
        ]
    },
    {
        id: 10,
        title: "Event Photographer",
        company: "Studio 24",
        location: "On-site (Phnom Penh)",
        type: "Freelance",
        salary: "$30 - $60/hr",
        posted: "5 hours ago",
        tags: ["Photography", "Editing", "Events", "Hourly Rate", "Freelance"],
        featured: false,
        category: "Photography",
        description: "Capture high-quality images for corporate and social events in Phnom Penh.",
        requirements: [
            "Professional photography equipment",
            "Portfolio of event photography",
            "Proficiency in photo editing software (Lightroom, Photoshop)",
            "Good interpersonal and communication skills"
        ],
        responsibilities: [
            "Photograph events according to client requirements",
            "Edit and retouch photos for final delivery",
            "Coordinate with event organizers",
            "Deliver photos within the agreed timeframe"
        ]
    },
];
