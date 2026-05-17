import type { HomeProject } from '../components/home/HomeSelectedWork';

export const homeProjects: HomeProject[] = [
  {
    title: 'uTap',
    description:
      'Campus digital wallet for South African students: campus vendor orders (uShop), event tickets (uGig), and phone-first campus access. Student app, vendor dashboard, and admin console in active build.',
    url: 'https://utaptech.co.za',
    tech: ['React Native', 'Expo', 'Supabase'],
    featured: true,
    wip: true,
    relatedLinks: [
      { label: 'Vendor portal', url: 'https://vendors.utaptech.co.za' },
    ],
  },
  {
    title: 'Trip (Taxi Assist)',
    description:
      'Compliance-first ride-hailing for verified drivers and riders: document-heavy onboarding, wallet and card payments, in-trip advertising credits, and ops tooling for pilot corridors in the Eastern Cape and Gauteng.',
    url: 'https://trip.qwabi.co.za/',
    tech: ['Flutter', 'Supabase', 'React'],
    wip: true,
    relatedLinks: [{ label: 'Trip Media', url: 'https://media.qwabi.co.za/' }],
  },
  {
    title: 'My Grad Zaka',
    description:
      'Milestone savings platform with locked and liquid vault discipline, sponsor contribution links, and a compliance layer built for FICA, POPIA, and AML from day one.',
    url: 'https://mygradzaka-web.vercel.app/',
    tech: ['React Native', 'Supabase', 'TypeScript'],
    wip: true,
  },
  {
    title: 'Future Start',
    description:
      'Student success services for South African tertiary learners: application support, mentoring, accommodation help, and national student excellence programs including SASEA.',
    url: 'https://www.futurestart.co.za/',
    tech: ['Web', 'Student services'],
  },
  {
    title: 'ClinicPlus',
    description:
      'Occupational health bookings for mining and construction companies in Witbank and Mpumalanga. Customer-facing web app and admin console with realtime coordination on the MERN stack.',
    url: 'https://clinicplusbooking.co.za/',
    tech: ['React', 'Node.js', 'MongoDB'],
  },
  {
    title: 'Laundry Marketplace',
    description:
      'A turnkey laundry marketplace connecting customers with local laundry service providers.',
    url: 'https://laundry.qwabi.co.za',
    tech: ['Next.js', 'React', 'Tailwind CSS'],
  },
  {
    title: 'Queens Connect',
    description:
      'A friendly AI companion for the Queenstown community, with local information and assistance.',
    url: 'https://queensconnect.qwabi.co.za',
    tech: ['AI', 'Next.js', 'OpenAI'],
  },
  {
    title: 'Kingly',
    description:
      'An AI tool for vibe coding documents and prompts, built for developer productivity.',
    url: 'https://kingly.qwabi.co.za',
    tech: ['AI', 'React', 'TypeScript'],
  },
  {
    title: 'eSpazza',
    description:
      'Xhosa hip hop music streaming and blogging celebrating Eastern Cape hip hop culture.',
    url: '/projects/espazza',
    tech: ['React', 'Express', 'MongoDB'],
  },
];
