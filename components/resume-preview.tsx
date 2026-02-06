
import React from 'react';
import { Mail, MapPin, Globe, Github, Linkedin, Briefcase, GraduationCap, FileText, User } from 'lucide-react';

interface ResumePreviewProps {
    data: any;
}

export const sampleResumeData = {
    firstName: "Alex",
    lastName: "Rivers",
    headline: "Senior Full Stack Engineer",
    bio: "Visionary developer with over 8 years of experience building scalable web applications. Expert in React, Node.js, and cloud architecture. Passionate about creating intuitive user experiences and mentoring junior developers. Proven track record of delivering high-impact features and optimizing system performance.",
    location: "San Francisco, CA",
    email: "alex.rivers@example.com",
    website: "alexrivers.dev",
    github: "arivers",
    linkedin: "alexrivers",
    skills: ["React", "TypeScript", "Node.js", "Next.js", "PostgreSQL", "AWS", "Docker", "GraphQL", "Tailwind CSS"],
    languages: ["English", "French"],
    experience: [
        {
            company: "TechNexus Solutions",
            role: "Senior Full Stack Developer",
            duration: "2021 - Present",
            description: "Led the migration of a legacy monolithic application to a microservices architecture, improving deployment speed by 40%. Mentored a team of 5 developers and implemented rigorous code review processes."
        },
        {
            company: "Innovate Digital",
            role: "Founding Engineer",
            duration: "2018 - 2021",
            description: "Built the MVP for a fintech platform that processed over $1M in transactions within the first 6 months. Developed a custom UI library used across all company products."
        }
    ],
    education: [
        {
            school: "Stanford University",
            degree: "M.S. in Computer Science",
            year: "2016 - 2018"
        },
        {
            school: "UC Berkeley",
            degree: "B.S. in Software Engineering",
            year: "2012 - 2016"
        }
    ]
};

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
    const getAvatarUrl = (path: string): string => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        return `${baseUrl}${path}`;
    };

    return (
        <div className="bg-white text-slate-900 w-full max-w-5xl min-h-[297mm] print:min-h-0 shadow-2xl overflow-hidden print:overflow-visible mx-auto font-sans print:shadow-none print:w-[210mm] print:max-w-none print:mx-0 print:rounded-none">
            <div className="flex flex-col h-full print:h-auto bg-white">
                {/* Premium Header */}
                <div className="bg-[#0f172a] text-white p-16 print:p-8 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-[-20deg] translate-x-32 print:hidden"></div>
                    <div className="relative z-10 flex-1">
                        <div className="inline-block px-3 py-1 bg-blue-600 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full mb-6 text-white/90">
                            Professional Resume
                        </div>
                        <h1 className="text-5xl print:text-4xl font-extrabold tracking-tight mb-3 print:mb-2 uppercase leading-none">
                            {data.firstName} <span className="text-blue-500">{data.lastName}</span>
                        </h1>
                        <p className="text-2xl print:text-xl text-slate-300 font-light tracking-wide mb-8 print:mb-4 max-w-2xl">{data.headline}</p>

                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm text-slate-400 font-medium">
                            {data.location && (
                                <span className="flex items-center gap-3">
                                    <MapPin className="h-4 w-4 text-blue-500" /> {data.location}
                                </span>
                            )}
                            {data.website && (
                                <span className="flex items-center gap-3">
                                    <Globe className="h-4 w-4 text-blue-500" /> {data.website}
                                </span>
                            )}
                            {data.github && (
                                <span className="flex items-center gap-3">
                                    <Github className="h-4 w-4 text-blue-500" /> {data.github}
                                </span>
                            )}
                            {data.linkedin && (
                                <span className="flex items-center gap-3">
                                    <Linkedin className="h-4 w-4 text-blue-500" /> {data.linkedin}
                                </span>
                            )}
                        </div>
                    </div>

                    {data.avatar && (
                        <div className="h-48 w-48 print:h-36 print:w-36 rounded-3xl overflow-hidden border-8 border-slate-800 shadow-2xl relative z-10 rotate-3 print:rotate-0 print:shadow-none print:border-slate-900">
                            <img
                                src={getAvatarUrl(data.avatar)}
                                className="h-full w-full object-cover"
                                alt="Profile"
                            />
                        </div>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="p-14 print:p-8 grid grid-cols-12 gap-12 print:gap-8">
                    {/* Left Column - Experience & Bio */}
                    <div className="col-span-8 space-y-16 print:space-y-6">
                        <section className="relative print:break-inside-avoid">
                            <h2 className="text-2xl print:text-lg font-black uppercase tracking-[0.15em] text-slate-900 mb-8 print:mb-4 flex items-center gap-4">
                                <span className="h-8 w-1.5 bg-blue-600 rounded-full"></span>
                                Executive Summary
                            </h2>
                            <p className="text-slate-600 leading-[1.7] print:leading-[1.5] text-base print:text-sm font-light text-justify">
                                {data.bio}
                            </p>
                        </section>

                        <section className="relative print:break-inside-avoid">
                            <h2 className="text-2xl print:text-lg font-black uppercase tracking-[0.15em] text-slate-900 mb-10 print:mb-6 flex items-center gap-4">
                                <span className="h-8 w-1.5 bg-blue-600 rounded-full"></span>
                                Professional Experience
                            </h2>
                            <div className="space-y-14 print:space-y-6">
                                {data.experience?.map((exp: any, i: number) => (
                                    <div key={i} className="group relative pl-8 border-l-2 border-slate-100 hover:border-blue-500 transition-colors duration-300 print:break-inside-avoid">
                                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-white border-2 border-slate-200 group-hover:border-blue-500 group-hover:scale-125 transition-all"></div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-lg print:text-base tracking-tight leading-none mb-1">{exp.role}</h3>
                                                <p className="text-blue-600 font-bold text-sm tracking-widest uppercase">{exp.company}</p>
                                            </div>
                                            <span className="text-[11px] font-black text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100 uppercase tracking-tighter">
                                                {exp.duration}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 text-base print:text-xs leading-relaxed mt-4 print:mt-1 font-light text-justify">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Skills & Education */}
                    <div className="col-span-4 space-y-16 print:space-y-6">
                        <section className="bg-slate-50 p-8 print:p-6 rounded-[40px] border border-slate-100 relative overflow-hidden print:overflow-visible group print:break-inside-avoid">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-10 print:mb-4 border-b-2 border-blue-600/20 pb-3 inline-block">Expertise</h2>
                            <div className="flex flex-wrap gap-3">
                                {data.skills?.map((skill: string) => (
                                    <span key={skill} className="bg-white text-slate-700 text-[11px] font-bold px-4 py-2 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:text-blue-600 transition-all cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>

                        <section className="px-6 print:px-2 print:break-inside-avoid">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-10 print:mb-4 border-b-2 border-blue-600/20 pb-3 inline-block">Education</h2>
                            <div className="space-y-10">
                                {data.education?.map((edu: any, i: number) => (
                                    <div key={i} className="relative group print:break-inside-avoid">
                                        <div className="absolute -left-8 top-1 h-3.5 w-3.5 rounded-full border-2 border-slate-200 group-hover:border-blue-600 transition-colors"></div>
                                        <h3 className="font-bold text-slate-900 text-[15px] print:text-xs leading-tight group-hover:text-blue-600 transition-colors">{edu.degree}</h3>
                                        <p className="text-slate-500 text-sm print:text-[10px] mt-1.5 print:mt-1 font-medium">{edu.school}</p>
                                        <p className="text-blue-600/60 text-[10px] font-black uppercase tracking-widest mt-3 bg-blue-50/50 inline-block px-3 py-1 rounded-full border border-blue-100/50">
                                            {edu.year}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="px-6 print:px-2 print:break-inside-avoid">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 print:mb-4 border-b-2 border-blue-600/20 pb-3 inline-block">Languages</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {data.languages?.map((lang: string) => (
                                    <div key={lang} className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">{lang}</span>
                                            <span className="text-[10px] font-black text-blue-500">PRO</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="w-full h-full bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Premium Footer */}
                <footer className="mt-auto p-16 print:p-8 border-t border-slate-100 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 bg-slate-50/30">
                    <div className="flex items-center gap-4">
                        <div className="h-6 w-px bg-slate-200"></div>
                        <span>Curriculum Vitae</span>
                    </div>
                    <span>{data.firstName} {data.lastName} • {new Date().getFullYear()}</span>
                </footer>
            </div>
        </div>
    );
};
