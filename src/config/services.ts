
export type ServiceId =
  | "mutual-funds"
  | "health-insurance"
  | "life-insurance"
  | "motor-insurance"
  | "financial-planning"
  | "wealth-management"
  | "sip-goal-investing"
  | "tax-planning";

export interface Service {
  id: ServiceId;
  number: string;
  title: string;
  short: string;
  description: string;
  features: string[];
  cta: string;
  /** Matches an option in `contactServiceOptions`. */
  contactValue: ContactService;
}

export const contactServiceOptions = [
  "Mutual Funds",
  "Health Insurance",
  "Life Insurance",
  "Motor Insurance",
  "Financial Planning",
  "Wealth Management",
  "SIP Investments",
  "Tax Planning",
  "General Enquiry",
] as const;

export type ContactService = (typeof contactServiceOptions)[number];

export const services: Service[] = [
  {
    id: "mutual-funds",
    number: "01",
    title: "Mutual Fund Investments",
    short: "Understand mutual funds, risk and time horizon before you invest.",
    description:
      "Mutual funds pool money from many investors into professionally managed portfolios. We help you understand how they work, how different categories behave, and how they may fit your goals and comfort with risk.",
    features: [
      "Mutual fund fundamentals explained in plain language",
      "SIP and lumpsum investing — when each approach may suit you",
      "Understanding risk, volatility and investment horizon",
      "Diversification across categories and asset classes",
      "Goal-based investing aligned with your timeline",
    ],
    cta: "Enquire about Mutual Funds",
    contactValue: "Mutual Funds",
  },
  {
    id: "health-insurance",
    number: "02",
    title: "Health Insurance",
    short: "Protect yourself and your family against unexpected medical expenses.",
    description:
      "Healthcare expenses can create significant financial pressure. We help you understand health insurance coverage, policy features and available options so you can make informed decisions about protecting yourself and your family.",
    features: [
      "Individual and family floater health insurance awareness",
      "Understanding sum insured and coverage benefits",
      "Cashless hospitalisation and reimbursement processes",
      "Understanding waiting periods and pre-existing conditions",
      "Policy exclusions, co-payment and room rent limits",
      "Health insurance renewal and coverage review",
    ],
    cta: "Enquire about Health Insurance",
    contactValue: "Health Insurance",
  },
  {
    id: "life-insurance",
    number: "03",
    title: "Life Insurance",
    short: "Help secure your family's financial future with appropriate life cover.",
    description:
      "Life insurance can play an important role in protecting your family's financial security. We help you understand different types of life insurance, coverage requirements and policy features based on your financial responsibilities.",
    features: [
      "Understanding term life insurance and its benefits",
      "Estimating life insurance coverage requirements",
      "Understanding policy tenure and premium structure",
      "Life insurance protection for family and dependants",
      "Understanding exclusions and policy conditions",
      "Reviewing existing life insurance coverage",
    ],
    cta: "Enquire about Life Insurance",
    contactValue: "Life Insurance",
  },
  {
    id: "motor-insurance",
    number: "04",
    title: "Motor Insurance",
    short: "Understand vehicle insurance options and protect your vehicle against unexpected risks.",
    description:
      "Motor insurance helps protect vehicle owners against financial losses arising from accidents, theft and other covered events. We help you understand available coverage options and important policy features for your vehicle.",
    features: [
      "Third-party motor insurance coverage awareness",
      "Comprehensive motor insurance options",
      "Own-damage and third-party protection explained",
      "Understanding add-on covers and their benefits",
      "No Claim Bonus and policy renewal awareness",
      "Understanding claims, exclusions and deductibles",
    ],
    cta: "Enquire about Motor Insurance",
    contactValue: "Motor Insurance",
  },
  {
    id: "financial-planning",
    number: "05",
    title: "Financial Planning",
    short: "A clear plan for goals, savings, protection and retirement.",
    description:
      "A good plan begins with your life, not with a product. We help you organise priorities, structure savings and think through the milestones that matter to you and your family.",
    features: [
      "Goal-based financial planning for every life stage",
      "Budget and savings structure",
      "Emergency fund awareness",
      "Retirement planning fundamentals",
      "Prioritising competing financial goals",
    ],
    cta: "Enquire about Financial Planning",
    contactValue: "Financial Planning",
  },
  {
    id: "wealth-management",
    number: "06",
    title: "Wealth Management",
    short: "Asset allocation, portfolio review and long-term wealth-building thinking.",
    description:
      "Wealth is built through allocation, patience and periodic review. We discuss how the pieces of your finances can work together towards your long-term objectives.",
    features: [
      "Asset allocation concepts and rebalancing awareness",
      "Periodic portfolio review conversations",
      "Wealth-building strategies for the long run",
      "Risk awareness across your whole portfolio",
      "Long-term financial objectives and legacy thinking",
    ],
    cta: "Enquire about Wealth Management",
    contactValue: "Wealth Management",
  },
  {
    id: "sip-goal-investing",
    number: "07",
    title: "SIP & Goal-Based Investing",
    short: "Invest regularly, link every investment to a goal and review it often.",
    description:
      "Systematic investing turns good intentions into a habit. We help you connect each SIP to a specific goal and horizon, and revisit it as your life evolves.",
    features: [
      "Systematic investing and the value of regular contributions",
      "Setting clear, measurable financial goals",
      "Matching investments to investment horizon",
      "Compounding explained — and why time matters",
      "Periodic reviews to keep your plan on track",
    ],
    cta: "Enquire about SIP Investing",
    contactValue: "SIP Investments",
  },
  {
    id: "tax-planning",
    number: "08",
    title: "Tax Planning",
    short: "Tax-saving awareness, explained clearly and responsibly.",
    description:
      "Tax efficiency is part of a sound financial plan. We share education about commonly used tax-saving investment categories and encourage you to consult a qualified tax professional for your situation.",
    features: [
      "Tax-saving awareness and planning timelines",
      "Overview of applicable investment categories",
      "Tax planning education in plain language",
      "Why professional tax guidance matters for your case",
    ],
    cta: "Enquire about Tax Planning",
    contactValue: "Tax Planning",
  },
];

export function findServiceById(id: string | null | undefined) {
  return services.find((s) => s.id === id);
}
