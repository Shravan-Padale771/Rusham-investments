
"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Calculator,
  ChartNoAxesCombined,
  GraduationCap,
  Landmark,
  PiggyBank,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from "lucide-react";

type Category = "investment" | "loan" | "goals";

const categories: { id: Category; label: string; icon: typeof PiggyBank }[] = [
  { id: "investment", label: "Investment", icon: ChartNoAxesCombined },
  { id: "loan", label: "Loan", icon: Landmark },
  { id: "goals", label: "Goal Planning", icon: PiggyBank },
];

const subTabs: Record<Category, { id: string; label: string }[]> = {
  investment: [
    { id: "sip", label: "SIP Calculator" },
    { id: "lumpsum", label: "Lumpsum Calculator" },
    { id: "stepup", label: "Step-up SIP" },
  ],
  loan: [{ id: "emi", label: "Loan EMI Calculator" }],
  goals: [
    { id: "retirement", label: "Retirement" },
    { id: "education", label: "Education Goal" },
    { id: "inflation", label: "Inflation Impact" },
    { id: "planner", label: "Goal Planner" },
  ],
};

const initialValues = {
  sip: 10000,
  sipYears: 15,
  sipReturn: 12,

  lumpsum: 500000,
  lumpsumYears: 10,
  lumpsumReturn: 12,

  stepSip: 10000,
  stepYears: 15,
  stepReturn: 12,
  stepIncrease: 10,

  loanAmount: 2500000,
  loanRate: 9,
  loanYears: 20,

  currentAge: 30,
  retirementAge: 60,
  lifeAge: 85,
  monthlyExpense: 50000,
  inflation: 6,
  preReturn: 12,
  postReturn: 8,
  existingRetirement: 0,

  educationCost: 2000000,
  educationYears: 10,
  educationInflation: 8,
  educationReturn: 12,
  existingEducation: 0,

  inflationAmount: 100000,
  inflationRate: 6,
  inflationYears: 10,

  goalAmount: 2500000,
  goalYears: 10,
  goalInflation: 6,
  goalReturn: 12,
  existingGoal: 0,
};

type Values = typeof initialValues;
type ValueKey = keyof Values;

const money = (value: number, compact = false) => {
  if (!Number.isFinite(value)) return "₹0";

  if (compact && Math.abs(value) >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }

  if (compact && Math.abs(value) >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const number = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function futureValueSIP(
  monthly: number,
  annualRate: number,
  years: number
) {
  const months = Math.max(0, Math.round(years * 12));
  const rate = annualRate / 1200;

  if (!months) return 0;
  if (rate === 0) return monthly * months;

  return monthly * ((Math.pow(1 + rate, months) - 1) / rate);
}

function sipForTarget(
  target: number,
  annualRate: number,
  years: number
) {
  const months = Math.max(0, Math.round(years * 12));
  const rate = annualRate / 1200;

  if (!months) return 0;
  if (rate === 0) return target / months;

  const factor = (Math.pow(1 + rate, months) - 1) / rate;
  return factor > 0 ? target / factor : 0;
}

function futureValueLumpsum(
  principal: number,
  annualRate: number,
  years: number
) {
  return principal * Math.pow(1 + annualRate / 100, years);
}

function futureValueStepUpSIP(
  monthly: number,
  annualRate: number,
  years: number,
  annualIncrease: number
) {
  const months = Math.max(0, Math.round(years * 12));
  const monthlyRate = annualRate / 1200;
  let value = 0;
  let invested = 0;

  for (let month = 1; month <= months; month++) {
    const completedYears = Math.floor((month - 1) / 12);
    const contribution =
      monthly * Math.pow(1 + annualIncrease / 100, completedYears);

    value = value * (1 + monthlyRate) + contribution;
    invested += contribution;
  }

  return { value, invested };
}

function loanEMI(principal: number, annualRate: number, years: number) {
  const months = Math.round(years * 12);
  const rate = annualRate / 1200;

  if (!months) return 0;
  if (rate === 0) return principal / months;

  const factor = Math.pow(1 + rate, months);
  return (principal * rate * factor) / (factor - 1);
}

function annuityFactor(rate: number, years: number) {
  if (years <= 0) return 0;
  if (Math.abs(rate) < 0.000001) return years;

  return (1 - Math.pow(1 + rate, -years)) / rate;
}

function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  prefix = "",
  suffix = "",
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  hint?: string;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#748B75]">
          {label}
        </label>

        <span className="text-[10px] text-[#748B75]">{hint}</span>
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-[#748B75]/30 pb-2">
        <div className="flex min-w-0 items-center gap-1">
          {prefix && (
            <span className="text-sm font-semibold text-[#748B75]">
              {prefix}
            </span>
          )}

          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) =>
              onChange(clamp(Number(e.target.value) || min, min, max))
            }
            className="w-full min-w-0 bg-transparent text-lg font-semibold text-[#181F1C] outline-none"
          />

          {suffix && (
            <span className="shrink-0 text-xs text-[#748B75]">
              {suffix}
            </span>
          )}
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, #128B80 ${percentage}%, #DCE5DF ${percentage}%)`,
        }}
        className="calculator-range h-1.5 w-full cursor-pointer appearance-none rounded-full"
      />

      <div className="flex justify-between text-[10px] text-[#748B75]">
        <span>{prefix}{number(min)}{suffix}</span>
        <span>{prefix}{number(max)}{suffix}</span>
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  description,
  featured = false,
  warning = false,
}: {
  label: string;
  value: string;
  description?: string;
  featured?: boolean;
  warning?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        featured
          ? "border-[#EE964B] bg-[#EE964B]/[0.07]"
          : warning
            ? "border-red-300 bg-red-50"
            : "border-[#748B75]/25 bg-white"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#748B75]">
        {label}
      </p>

      <p
        className={`mt-2 break-words font-semibold tracking-tight ${
          featured
            ? "text-2xl text-[#181F1C]"
            : warning
              ? "text-xl text-red-700"
              : "text-xl text-[#181F1C]"
        }`}
      >
        {value}
      </p>

      {description && (
        <p className="mt-1 text-xs text-[#748B75]">{description}</p>
      )}
    </div>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-xl font-bold text-[#181F1C] sm:text-2xl">
        {title}
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-[#748B75]">
        {description}
      </p>
    </div>
  );
}

function ChartPanel({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: { label: string; value: number; color: string }[];
}) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="rounded-xl border border-[#748B75]/25 bg-white p-5">
      <div className="mb-5">
        <h3 className="font-semibold text-[#181F1C]">{title}</h3>
        <p className="mt-1 text-xs text-[#748B75]">{subtitle}</p>
      </div>

      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between gap-3 text-xs">
              <span className="text-[#748B75]">{item.label}</span>
              <span className="font-semibold text-[#181F1C]">
                {money(item.value, true)}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-[#EFF9F0]">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.max(0, (item.value / maxValue) * 100)}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-4 border-t border-[#748B75]/20 pt-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[10px] text-[#748B75]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GrowthChart({
  title,
  invested,
  returns,
}: {
  title: string;
  invested: number;
  returns: number;
}) {
  const total = Math.max(invested + returns, 1);
  const investedPercent = (invested / total) * 100;
  const returnPercent = (returns / total) * 100;

  return (
    <div className="rounded-xl border border-[#748B75]/25 bg-white p-5">
      <h3 className="font-semibold text-[#181F1C]">{title}</h3>
      <p className="mt-1 text-xs text-[#748B75]">
        Principal versus estimated growth
      </p>

      <div className="mt-7">
        <div className="flex h-7 w-full overflow-hidden rounded-lg">
          <div
            className="bg-[#128B80] transition-all duration-300"
            style={{ width: `${investedPercent}%` }}
          />
          <div
            className="bg-[#EE964B] transition-all duration-300"
            style={{ width: `${returnPercent}%` }}
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#748B75]">
              Invested amount
            </span>
            <p className="mt-1 font-semibold text-[#181F1C]">
              {money(invested, true)}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#748B75]">
              Estimated returns
            </span>
            <p className="mt-1 font-semibold text-[#181F1C]">
              {money(returns, true)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoanSchedule({
  amount,
  annualRate,
  years,
}: {
  amount: number;
  annualRate: number;
  years: number;
}) {
  const schedule = useMemo(() => {
    const emi = loanEMI(amount, annualRate, years);
    const monthlyRate = annualRate / 1200;
    const months = Math.round(years * 12);
    let balance = amount;

    const rows: {
      year: number;
      principal: number;
      interest: number;
      balance: number;
    }[] = [];

    for (let year = 1; year <= years; year++) {
      let principalPaid = 0;
      let interestPaid = 0;

      for (let month = 0; month < 12 && (year - 1) * 12 + month < months; month++) {
        const interest = balance * monthlyRate;
        const principal = Math.min(balance, Math.max(0, emi - interest));

        interestPaid += interest;
        principalPaid += principal;
        balance = Math.max(0, balance - principal);
      }

      rows.push({
        year,
        principal: principalPaid,
        interest: interestPaid,
        balance,
      });
    }

    return rows;
  }, [amount, annualRate, years]);

  return (
    <div className="overflow-hidden rounded-xl border border-[#748B75]/25 bg-white">
      <div className="border-b border-[#748B75]/20 p-5">
        <h3 className="font-semibold text-[#181F1C]">
          Year-by-year repayment breakdown
        </h3>
        <p className="mt-1 text-xs text-[#748B75]">
          Estimated principal, interest and remaining loan balance.
        </p>
      </div>

      <div className="max-h-[420px] overflow-auto">
        <table className="w-full min-w-[540px] text-left text-sm">
          <thead className="sticky top-0 bg-[#EFF9F0] text-[10px] uppercase tracking-wider text-[#748B75]">
            <tr>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Principal paid</th>
              <th className="px-4 py-3">Interest paid</th>
              <th className="px-4 py-3">Balance</th>
            </tr>
          </thead>

          <tbody>
            {schedule.map((row) => (
              <tr
                key={row.year}
                className="border-t border-[#748B75]/15"
              >
                <td className="px-4 py-3 font-semibold text-[#181F1C]">
                  {row.year}
                </td>
                <td className="px-4 py-3 text-[#181F1C]">
                  {money(row.principal)}
                </td>
                <td className="px-4 py-3 text-[#748B75]">
                  {money(row.interest)}
                </td>
                <td className="px-4 py-3 font-semibold text-[#181F1C]">
                  {money(row.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CalculatorsPage() {
  const [category, setCategory] = useState<Category>("investment");
  const [active, setActive] = useState("sip");
  const [values, setValues] = useState<Values>(initialValues);

  const update = (key: ValueKey, value: number) => {
    setValues((previous) => ({ ...previous, [key]: value }));
  };

  const changeCategory = (next: Category) => {
    setCategory(next);
    setActive(subTabs[next][0].id);
  };

  const reset = () => {
    setValues(initialValues);
  };

  const v = values;

  // Investment calculations
  const sipInvested = v.sip * v.sipYears * 12;
  const sipTotal = futureValueSIP(v.sip, v.sipReturn, v.sipYears);
  const sipProfit = sipTotal - sipInvested;

  const lumpsumTotal = futureValueLumpsum(
    v.lumpsum,
    v.lumpsumReturn,
    v.lumpsumYears
  );
  const lumpsumProfit = lumpsumTotal - v.lumpsum;

  const stepResult = futureValueStepUpSIP(
    v.stepSip,
    v.stepReturn,
    v.stepYears,
    v.stepIncrease
  );
  const stepProfit = stepResult.value - stepResult.invested;

  // Loan calculations
  const emi = loanEMI(v.loanAmount, v.loanRate, v.loanYears);
  const loanTotal = emi * v.loanYears * 12;
  const loanInterest = loanTotal - v.loanAmount;

  // Retirement calculations
  const retirementYears = Math.max(0, v.retirementAge - v.currentAge);
  const drawdownYears = Math.max(1, v.lifeAge - v.retirementAge);

  const retirementExpense =
    v.monthlyExpense *
    Math.pow(1 + v.inflation / 100, retirementYears);

  const realReturn =
    (1 + v.postReturn / 100) / (1 + v.inflation / 100) - 1;

  const retirementCorpus =
    retirementExpense *
    12 *
    annuityFactor(realReturn, drawdownYears);

  const existingRetirementFuture = futureValueLumpsum(
    v.existingRetirement,
    v.preReturn,
    retirementYears
  );

  const retirementGap = Math.max(
    0,
    retirementCorpus - existingRetirementFuture
  );

  const retirementSIP = sipForTarget(
    retirementGap,
    v.preReturn,
    retirementYears
  );

  const retirementShortfall =
    retirementCorpus - existingRetirementFuture;

  // Education calculations
  const educationFutureCost =
    v.educationCost *
    Math.pow(1 + v.educationInflation / 100, v.educationYears);

  const educationExistingFuture = futureValueLumpsum(
    v.existingEducation,
    v.educationReturn,
    v.educationYears
  );

  const educationGap = Math.max(
    0,
    educationFutureCost - educationExistingFuture
  );

  const educationSIP = sipForTarget(
    educationGap,
    v.educationReturn,
    v.educationYears
  );

  // Inflation calculations
  const inflationFutureCost =
    v.inflationAmount *
    Math.pow(1 + v.inflationRate / 100, v.inflationYears);

  const futurePurchasingPower =
    v.inflationAmount /
    Math.pow(1 + v.inflationRate / 100, v.inflationYears);

  const purchasingPowerLost =
    v.inflationAmount - futurePurchasingPower;

  // Goal planner calculations
  const goalFutureTarget =
    v.goalAmount * Math.pow(1 + v.goalInflation / 100, v.goalYears);

  const goalExistingFuture = futureValueLumpsum(
    v.existingGoal,
    v.goalReturn,
    v.goalYears
  );

  const goalGap = goalFutureTarget - goalExistingFuture;

  const goalSIP = sipForTarget(
    Math.max(0, goalGap),
    v.goalReturn,
    v.goalYears
  );

  const goalOneTime =
    Math.max(0, goalGap) /
    Math.pow(1 + v.goalReturn / 100, v.goalYears);

  const currentSubTabs = subTabs[category];

  return (
    <main className="min-h-screen bg-[#EFF9F0] text-[#181F1C]">
      <style jsx global>{`
        .calculator-range::-webkit-slider-thumb {
          appearance: none;
          width: 17px;
          height: 17px;
          border: 3px solid white;
          border-radius: 50%;
          background: #128b80;
          box-shadow: 0 0 0 1px #128b80;
        }

        .calculator-range::-moz-range-thumb {
          width: 13px;
          height: 13px;
          border: 3px solid white;
          border-radius: 50%;
          background: #128b80;
          box-shadow: 0 0 0 1px #128b80;
        }

        .calculator-range {
          accent-color: #128b80;
        }
      `}</style>

      {/* Header */}
      <section className="relative overflow-hidden bg-[#181F1C] px-5 py-16 text-[#EFF9F0] sm:px-8 lg:py-20">
        <div className="pointer-events-none absolute -right-24 -top-40 h-96 w-96 rounded-full border border-[#748B75]/20" />
        <div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full border border-[#748B75]/20" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-9 bg-[#EE964B]" />
            <span className="text-[10px] font-bold uppercase tracking-[.25em] text-[#EE964B]">
              Financial planning tools
            </span>
          </div>

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Make informed decisions.
                <span className="block text-[#B298DC]">
                  Plan your financial future.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#EFF9F0]/70 sm:text-base">
                Explore investments, understand loan repayments and plan
                important life goals with our collection of financial
                calculators.
              </p>
            </div>

            <div className="flex items-center gap-3 border-l border-[#748B75]/50 pl-5">
              <ShieldCheck className="h-8 w-8 text-[#EE964B]" />
              <div>
                <p className="text-xs font-semibold text-[#EFF9F0]">
                  Plan with clarity
                </p>
                <p className="mt-1 text-[10px] text-[#EFF9F0]/55">
                  Understand your numbers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main calculator area */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        {/* Main category selection */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {categories.map((item) => {
            const Icon = item.icon;
            const selected = category === item.id;

            return (
              <button
                key={item.id}
                onClick={() => changeCategory(item.id)}
                className={`flex items-center gap-4 rounded-xl border p-5 text-left transition-all duration-200 ${
                  selected
                    ? "border-[#181F1C] bg-[#181F1C] text-[#EFF9F0] shadow-lg"
                    : "border-[#748B75]/25 bg-white text-[#181F1C] hover:border-[#748B75]"
                }`}
              >
                <div
                  className={`grid h-12 w-12 place-items-center rounded-lg ${
                    selected
                      ? "bg-[#EE964B] text-[#181F1C]"
                      : "bg-[#EFF9F0] text-[#748B75]"
                  }`}
                >
                  <Icon size={23} />
                </div>

                <div className="flex-1">
                  <p className="font-semibold">{item.label}</p>
                  <p
                    className={`mt-1 text-xs ${
                      selected ? "text-white/60" : "text-[#748B75]"
                    }`}
                  >
                    {item.id === "investment"
                      ? "Grow your wealth"
                      : item.id === "loan"
                        ? "Plan your repayments"
                        : "Prepare for life goals"}
                  </p>
                </div>

                <ArrowRight
                  size={17}
                  className={selected ? "text-[#EE964B]" : "text-[#748B75]"}
                />
              </button>
            );
          })}
        </div>

        {/* Calculator workspace */}
        <div className="overflow-hidden rounded-2xl border border-[#748B75]/25 bg-white shadow-sm">
          {/* Workspace header */}
          <div className="flex flex-col justify-between gap-5 border-b border-[#748B75]/20 p-5 sm:flex-row sm:items-center sm:px-7 sm:py-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#748B75]">
                {category === "investment"
                  ? "Investment planning"
                  : category === "loan"
                    ? "Loan planning"
                    : "Future planning"}
              </p>

              <h2 className="mt-2 font-display text-2xl font-bold text-[#181F1C]">
                {category === "investment"
                  ? "Investment Calculators"
                  : category === "loan"
                    ? "Loan Calculator"
                    : "Goal Planning Calculators"}
              </h2>
            </div>

            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-[#748B75]/30 px-4 py-2.5 text-xs font-semibold text-[#748B75] transition-colors hover:border-[#EE964B] hover:text-[#181F1C] sm:self-auto"
            >
              <RefreshCw size={14} />
              Reset values
            </button>
          </div>

          {/* Sub calculator tabs */}
          <div className="flex gap-2 overflow-x-auto border-b border-[#748B75]/20 px-4 py-3 sm:px-7">
            {currentSubTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`shrink-0 rounded-lg px-4 py-2.5 text-xs font-semibold transition-all ${
                  active === tab.id
                    ? "bg-[#181F1C] text-[#EFF9F0]"
                    : "text-[#748B75] hover:bg-[#EFF9F0] hover:text-[#181F1C]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Calculator content */}
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            {/* LEFT: Inputs */}
            <div className="space-y-7 border-b border-[#748B75]/20 p-5 sm:p-7 lg:border-b-0 lg:border-r">
              {active === "sip" && (
                <>
                  <SectionHeading
                    title="SIP Calculator"
                    description="Estimate how your monthly investments may grow over time."
                  />

                  <RangeField
                    label="Monthly investment"
                    prefix="₹"
                    value={v.sip}
                    min={500}
                    max={200000}
                    step={500}
                    onChange={(n) => update("sip", n)}
                  />

                  <RangeField
                    label="Investment period"
                    value={v.sipYears}
                    min={1}
                    max={40}
                    suffix=" years"
                    onChange={(n) => update("sipYears", n)}
                  />

                  <RangeField
                    label="Expected annual return"
                    value={v.sipReturn}
                    min={1}
                    max={30}
                    step={0.5}
                    suffix="%"
                    onChange={(n) => update("sipReturn", n)}
                  />
                </>
              )}

              {active === "lumpsum" && (
                <>
                  <SectionHeading
                    title="Lumpsum Calculator"
                    description="Calculate the potential future value of a one-time investment."
                  />

                  <RangeField
                    label="One-time investment"
                    value={v.lumpsum}
                    min={1000}
                    max={10000000}
                    step={1000}
                    prefix="₹"
                    onChange={(n) => update("lumpsum", n)}
                  />

                  <RangeField
                    label="Investment period"
                    value={v.lumpsumYears}
                    min={1}
                    max={40}
                    suffix=" years"
                    onChange={(n) => update("lumpsumYears", n)}
                  />

                  <RangeField
                    label="Expected annual return"
                    value={v.lumpsumReturn}
                    min={1}
                    max={30}
                    step={0.5}
                    suffix="%"
                    onChange={(n) => update("lumpsumReturn", n)}
                  />
                </>
              )}

              {active === "stepup" && (
                <>
                  <SectionHeading
                    title="Step-up SIP Calculator"
                    description="Increase your monthly SIP by a fixed percentage every year."
                  />

                  <RangeField
                    label="Starting monthly SIP"
                    value={v.stepSip}
                    min={500}
                    max={200000}
                    step={500}
                    prefix="₹"
                    onChange={(n) => update("stepSip", n)}
                  />

                  <RangeField
                    label="Annual SIP increase"
                    value={v.stepIncrease}
                    min={1}
                    max={30}
                    suffix="%"
                    onChange={(n) => update("stepIncrease", n)}
                  />

                  <RangeField
                    label="Investment period"
                    value={v.stepYears}
                    min={1}
                    max={40}
                    suffix=" years"
                    onChange={(n) => update("stepYears", n)}
                  />

                  <RangeField
                    label="Expected annual return"
                    value={v.stepReturn}
                    min={1}
                    max={30}
                    step={0.5}
                    suffix="%"
                    onChange={(n) => update("stepReturn", n)}
                  />
                </>
              )}

              {active === "emi" && (
                <>
                  <SectionHeading
                    title="Loan EMI Calculator"
                    description="Estimate your monthly EMI and understand your total borrowing cost."
                  />

                  <RangeField
                    label="Loan amount"
                    value={v.loanAmount}
                    min={50000}
                    max={100000000}
                    step={50000}
                    prefix="₹"
                    onChange={(n) => update("loanAmount", n)}
                  />

                  <RangeField
                    label="Annual interest rate"
                    value={v.loanRate}
                    min={1}
                    max={25}
                    step={0.1}
                    suffix="% p.a."
                    onChange={(n) => update("loanRate", n)}
                  />

                  <RangeField
                    label="Loan tenure"
                    value={v.loanYears}
                    min={1}
                    max={30}
                    suffix=" years"
                    onChange={(n) => update("loanYears", n)}
                  />

                  <div className="rounded-xl bg-[#EFF9F0] p-4">
                    <p className="text-xs font-semibold text-[#181F1C]">
                      Loan summary
                    </p>
                    <div className="mt-3 flex justify-between text-xs">
                      <span className="text-[#748B75]">Loan duration</span>
                      <span className="font-semibold">
                        {v.loanYears * 12} months
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between text-xs">
                      <span className="text-[#748B75]">Interest rate</span>
                      <span className="font-semibold">
                        {v.loanRate}% annually
                      </span>
                    </div>
                  </div>
                </>
              )}

              {active === "retirement" && (
                <>
                  <SectionHeading
                    title="Retirement Calculator"
                    description="Estimate the retirement corpus required to support your future lifestyle."
                  />

                  <RangeField
                    label="Present age"
                    value={v.currentAge}
                    min={18}
                    max={60}
                    suffix=" years"
                    onChange={(n) =>
                      setValues((old) => ({
                        ...old,
                        currentAge: Math.min(n, old.retirementAge - 1),
                      }))
                    }
                  />

                  <RangeField
                    label="Retirement age"
                    value={v.retirementAge}
                    min={40}
                    max={75}
                    suffix=" years"
                    onChange={(n) =>
                      setValues((old) => ({
                        ...old,
                        retirementAge: Math.max(n, old.currentAge + 1),
                        lifeAge: Math.max(old.lifeAge, n + 1),
                      }))
                    }
                  />

                  <RangeField
                    label="Life expectancy"
                    value={v.lifeAge}
                    min={60}
                    max={100}
                    suffix=" years"
                    onChange={(n) =>
                      update("lifeAge", Math.max(n, v.retirementAge + 1))
                    }
                  />

                  <RangeField
                    label="Current monthly expenses"
                    value={v.monthlyExpense}
                    min={5000}
                    max={500000}
                    step={1000}
                    prefix="₹"
                    onChange={(n) => update("monthlyExpense", n)}
                  />

                  <RangeField
                    label="Expected inflation"
                    value={v.inflation}
                    min={1}
                    max={15}
                    step={0.5}
                    suffix="%"
                    onChange={(n) => update("inflation", n)}
                  />

                  <RangeField
                    label="Expected pre-retirement return"
                    value={v.preReturn}
                    min={1}
                    max={25}
                    step={0.5}
                    suffix="%"
                    onChange={(n) => update("preReturn", n)}
                  />

                  <RangeField
                    label="Expected post-retirement return"
                    value={v.postReturn}
                    min={1}
                    max={20}
                    step={0.5}
                    suffix="%"
                    onChange={(n) => update("postReturn", n)}
                  />

                  <RangeField
                    label="Existing investments"
                    value={v.existingRetirement}
                    min={0}
                    max={50000000}
                    step={50000}
                    prefix="₹"
                    onChange={(n) => update("existingRetirement", n)}
                  />
                </>
              )}

              {active === "education" && (
                <>
                  <SectionHeading
                    title="Education Goal Calculator"
                    description="Plan ahead for education expenses and calculate the SIP required."
                  />

                  <RangeField
                    label="Current education cost"
                    value={v.educationCost}
                    min={100000}
                    max={10000000}
                    step={10000}
                    prefix="₹"
                    onChange={(n) => update("educationCost", n)}
                  />

                  <RangeField
                    label="Years until education"
                    value={v.educationYears}
                    min={1}
                    max={30}
                    suffix=" years"
                    onChange={(n) => update("educationYears", n)}
                  />

                  <RangeField
                    label="Education inflation"
                    value={v.educationInflation}
                    min={1}
                    max={20}
                    step={0.5}
                    suffix="%"
                    onChange={(n) => update("educationInflation", n)}
                  />

                  <RangeField
                    label="Expected investment return"
                    value={v.educationReturn}
                    min={1}
                    max={30}
                    step={0.5}
                    suffix="%"
                    onChange={(n) => update("educationReturn", n)}
                  />

                  <RangeField
                    label="Existing education savings"
                    value={v.existingEducation}
                    min={0}
                    max={5000000}
                    step={10000}
                    prefix="₹"
                    onChange={(n) => update("existingEducation", n)}
                  />
                </>
              )}

              {active === "inflation" && (
                <>
                  <SectionHeading
                    title="Inflation Impact Calculator"
                    description="Understand how inflation affects the future cost and purchasing power of money."
                  />

                  <RangeField
                    label="Current amount / expense"
                    value={v.inflationAmount}
                    min={1000}
                    max={10000000}
                    step={1000}
                    prefix="₹"
                    onChange={(n) => update("inflationAmount", n)}
                  />

                  <RangeField
                    label="Annual inflation rate"
                    value={v.inflationRate}
                    min={1}
                    max={20}
                    step={0.5}
                    suffix="%"
                    onChange={(n) => update("inflationRate", n)}
                  />

                  <RangeField
                    label="Time period"
                    value={v.inflationYears}
                    min={1}
                    max={40}
                    suffix=" years"
                    onChange={(n) => update("inflationYears", n)}
                  />

                  <div className="rounded-xl border border-[#748B75]/25 bg-[#EFF9F0] p-4">
                    <p className="text-xs font-semibold text-[#181F1C]">
                      What this means
                    </p>
                    <p className="mt-2 text-xs leading-6 text-[#748B75]">
                      If prices increase by your selected inflation rate,
                      the same amount of money will buy fewer goods and
                      services in the future.
                    </p>
                  </div>
                </>
              )}

              {active === "planner" && (
                <>
                  <SectionHeading
                    title="Goal Planner"
                    description="Calculate how much you need to invest to achieve a future financial target."
                  />

                  <RangeField
                    label="Current goal amount"
                    value={v.goalAmount}
                    min={50000}
                    max={50000000}
                    step={10000}
                    prefix="₹"
                    onChange={(n) => update("goalAmount", n)}
                  />

                  <RangeField
                    label="Years to achieve goal"
                    value={v.goalYears}
                    min={1}
                    max={40}
                    suffix=" years"
                    onChange={(n) => update("goalYears", n)}
                  />

                  <RangeField
                    label="Expected inflation"
                    value={v.goalInflation}
                    min={1}
                    max={15}
                    step={0.5}
                    suffix="%"
                    onChange={(n) => update("goalInflation", n)}
                  />

                  <RangeField
                    label="Expected investment return"
                    value={v.goalReturn}
                    min={1}
                    max={30}
                    step={0.5}
                    suffix="%"
                    onChange={(n) => update("goalReturn", n)}
                  />

                  <RangeField
                    label="Existing investments"
                    value={v.existingGoal}
                    min={0}
                    max={50000000}
                    step={10000}
                    prefix="₹"
                    onChange={(n) => update("existingGoal", n)}
                  />
                </>
              )}
            </div>

            {/* RIGHT: Results */}
            <div className="space-y-5 bg-[#F8FAF8] p-5 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#748B75]">
                    Your calculation
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-[#181F1C]">
                    Results & projections
                  </h3>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#181F1C] text-[#EE964B]">
                  <Calculator size={19} />
                </div>
              </div>

              {/* SIP Results */}
              {active === "sip" && (
                <>
                  <ResultCard
                    label="Total investment value"
                    value={money(sipTotal)}
                    featured
                    description={`${v.sipYears} years of monthly investing`}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <ResultCard
                      label="Investment amount"
                      value={money(sipInvested)}
                    />
                    <ResultCard
                      label="Estimated returns"
                      value={money(sipProfit)}
                    />
                  </div>

                  <ResultCard
                    label="Growth on invested amount"
                    value={`${sipInvested > 0 ? (sipProfit / sipInvested * 100).toFixed(1) : "0"}%`}
                    description="Estimated return compared with principal invested"
                  />

                  <GrowthChart
                    title="Investment growth composition"
                    invested={sipInvested}
                    returns={sipProfit}
                  />

                  <ChartPanel
                    title="Investment summary"
                    subtitle="Compare your contribution with projected growth."
                    items={[
                      {
                        label: "Invested",
                        value: sipInvested,
                        color: "#128B80",
                      },
                      {
                        label: "Returns",
                        value: sipProfit,
                        color: "#EE964B",
                      },
                      {
                        label: "Total value",
                        value: sipTotal,
                        color: "#748B75",
                      },
                    ]}
                  />
                </>
              )}

              {/* Lumpsum Results */}
              {active === "lumpsum" && (
                <>
                  <ResultCard
                    label="Total investment value"
                    value={money(lumpsumTotal)}
                    featured
                    description={`${v.lumpsumYears} years of estimated growth`}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <ResultCard
                      label="Initial investment"
                      value={money(v.lumpsum)}
                    />
                    <ResultCard
                      label="Estimated returns"
                      value={money(lumpsumProfit)}
                    />
                  </div>

                  <ResultCard
                    label="Growth on invested amount"
                    value={`${v.lumpsum > 0 ? (lumpsumProfit / v.lumpsum * 100).toFixed(1) : "0"}%`}
                  />

                  <GrowthChart
                    title="Lumpsum growth composition"
                    invested={v.lumpsum}
                    returns={lumpsumProfit}
                  />

                  <ChartPanel
                    title="Investment summary"
                    subtitle="Your original capital versus projected returns."
                    items={[
                      {
                        label: "Initial investment",
                        value: v.lumpsum,
                        color: "#128B80",
                      },
                      {
                        label: "Estimated returns",
                        value: lumpsumProfit,
                        color: "#EE964B",
                      },
                      {
                        label: "Total value",
                        value: lumpsumTotal,
                        color: "#748B75",
                      },
                    ]}
                  />
                </>
              )}

              {/* Step-up SIP Results */}
              {active === "stepup" && (
                <>
                  <ResultCard
                    label="Total investment value"
                    value={money(stepResult.value)}
                    featured
                    description={`${v.stepIncrease}% annual increase in SIP`}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <ResultCard
                      label="Total invested"
                      value={money(stepResult.invested)}
                    />
                    <ResultCard
                      label="Estimated returns"
                      value={money(stepProfit)}
                    />
                  </div>

                  <ResultCard
                    label="Growth on invested amount"
                    value={`${stepResult.invested > 0 ? (stepProfit / stepResult.invested * 100).toFixed(1) : "0"}%`}
                  />

                  <GrowthChart
                    title="Step-up SIP composition"
                    invested={stepResult.invested}
                    returns={stepProfit}
                  />

                  <div className="rounded-xl border border-[#748B75]/25 bg-white p-4">
                    <p className="text-xs font-semibold text-[#181F1C]">
                      Your SIP contribution
                    </p>
                    <p className="mt-2 text-2xl font-bold text-[#128B80]">
                      {money(v.stepSip)}
                    </p>
                    <p className="mt-1 text-xs text-[#748B75]">
                      Starting monthly SIP
                    </p>
                    <p className="mt-4 text-xs text-[#748B75]">
                      Your monthly contribution increases by{" "}
                      <strong>{v.stepIncrease}%</strong> at the beginning
                      of each investment year.
                    </p>
                  </div>
                </>
              )}

              {/* Loan Results */}
              {active === "emi" && (
                <>
                  <ResultCard
                    label="Monthly EMI"
                    value={money(emi)}
                    featured
                    description={`${v.loanYears * 12} monthly payments`}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <ResultCard
                      label="Principal amount"
                      value={money(v.loanAmount)}
                    />
                    <ResultCard
                      label="Total interest"
                      value={money(loanInterest)}
                    />
                  </div>

                  <ResultCard
                    label="Total payment"
                    value={money(loanTotal)}
                  />

                  <ChartPanel
                    title="Loan payment composition"
                    subtitle="Principal and interest over the full loan tenure."
                    items={[
                      {
                        label: "Principal",
                        value: v.loanAmount,
                        color: "#128B80",
                      },
                      {
                        label: "Interest",
                        value: loanInterest,
                        color: "#EE964B",
                      },
                    ]}
                  />

                  <LoanSchedule
                    amount={v.loanAmount}
                    annualRate={v.loanRate}
                    years={v.loanYears}
                  />
                </>
              )}

              {/* Retirement Results */}
              {active === "retirement" && (
                <>
                  <ResultCard
                    label="Recommended retirement kitty amount"
                    value={money(retirementCorpus)}
                    featured
                    description={`At retirement age ${v.retirementAge}`}
                  />

                  <div className="rounded-xl border border-[#748B75]/25 bg-white p-4">
                    <p className="mb-3 text-xs font-bold text-[#181F1C]">
                      Required investment amount
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <div className="rounded-lg border border-[#748B75]/20 p-3">
                        <p className="text-[9px] uppercase tracking-wider text-[#748B75]">
                          Monthly
                        </p>
                        <p className="mt-1 font-bold text-[#181F1C]">
                          {money(retirementSIP, true)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-[#748B75]/20 p-3">
                        <p className="text-[9px] uppercase tracking-wider text-[#748B75]">
                          Yearly
                        </p>
                        <p className="mt-1 font-bold text-[#181F1C]">
                          {money(retirementSIP * 12, true)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-[#748B75]/20 p-3">
                        <p className="text-[9px] uppercase tracking-wider text-[#748B75]">
                          Existing investment FV
                        </p>
                        <p className="mt-1 font-bold text-[#181F1C]">
                          {money(existingRetirementFuture, true)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <ResultCard
                      label="Future monthly expenses"
                      value={money(retirementExpense)}
                    />
                    <ResultCard
                      label="Retirement duration"
                      value={`${drawdownYears} years`}
                    />
                  </div>

                  <ResultCard
                    label="Shortfall / surplus to target"
                    value={money(retirementShortfall)}
                    warning={retirementShortfall > 0}
                    description={
                      retirementShortfall > 0
                        ? "Additional corpus needed at retirement"
                        : "Existing investments cover the estimated target"
                    }
                  />

                  <div className="rounded-xl border border-[#748B75]/25 bg-white p-5">
                    <h3 className="font-semibold text-[#181F1C]">
                      Your financial timeline
                    </h3>

                    <div className="mt-4 flex h-7 overflow-hidden rounded-lg">
                      <div
                        className="flex items-center justify-center bg-[#128B80] text-[9px] font-bold text-white"
                        style={{
                          width: `${(retirementYears / (retirementYears + drawdownYears)) * 100}%`,
                        }}
                      >
                        ACCUMULATE
                      </div>
                      <div className="flex flex-1 items-center justify-center bg-[#B18A24] text-[9px] font-bold text-white">
                        DRAW DOWN
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between text-[10px] text-[#748B75]">
                      <span>Age {v.currentAge}</span>
                      <span>Retire at {v.retirementAge}</span>
                      <span>Age {v.lifeAge}</span>
                    </div>
                  </div>

                  <ChartPanel
                    title="Retirement corpus breakdown"
                    subtitle="Compare projected existing investments and the retirement target."
                    items={[
                      {
                        label: "Retirement target",
                        value: retirementCorpus,
                        color: "#EE964B",
                      },
                      {
                        label: "Existing investment FV",
                        value: existingRetirementFuture,
                        color: "#128B80",
                      },
                      {
                        label: "Required gap",
                        value: retirementGap,
                        color: "#748B75",
                      },
                    ]}
                  />
                </>
              )}

              {/* Education Results */}
              {active === "education" && (
                <>
                  <ResultCard
                    label="Future education cost"
                    value={money(educationFutureCost)}
                    featured
                    description={`Estimated in ${v.educationYears} years`}
                  />

                  <ResultCard
                    label="Required monthly SIP"
                    value={money(educationSIP)}
                    description="Estimated monthly investment required"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <ResultCard
                      label="Current education cost"
                      value={money(v.educationCost)}
                    />
                    <ResultCard
                      label="Future value of existing savings"
                      value={money(educationExistingFuture)}
                    />
                  </div>

                  <ResultCard
                    label="Additional amount to fund"
                    value={money(educationGap)}
                  />

                  <ChartPanel
                    title="Education goal projection"
                    subtitle="Future education cost versus existing savings and remaining goal."
                    items={[
                      {
                        label: "Future cost",
                        value: educationFutureCost,
                        color: "#EE964B",
                      },
                      {
                        label: "Existing savings FV",
                        value: educationExistingFuture,
                        color: "#128B80",
                      },
                      {
                        label: "Remaining goal",
                        value: educationGap,
                        color: "#748B75",
                      },
                    ]}
                  />
                </>
              )}

              {/* Inflation Results */}
              {active === "inflation" && (
                <>
                  <ResultCard
                    label="Future cost"
                    value={money(inflationFutureCost)}
                    featured
                    description={`After ${v.inflationYears} years`}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <ResultCard
                      label="Current cost"
                      value={money(v.inflationAmount)}
                    />
                    <ResultCard
                      label="Increase due to inflation"
                      value={money(inflationFutureCost - v.inflationAmount)}
                    />
                  </div>

                  <ResultCard
                    label="Purchasing power remaining"
                    value={money(futurePurchasingPower)}
                    description="Today's money expressed in future purchasing power"
                  />

                  <ResultCard
                    label="Purchasing power lost"
                    value={money(purchasingPowerLost)}
                    warning
                    description={`${(purchasingPowerLost / v.inflationAmount * 100).toFixed(1)}% of today's purchasing power`}
                  />

                  <ChartPanel
                    title="Impact of inflation"
                    subtitle="Compare the original amount and future cost."
                    items={[
                      {
                        label: "Current amount",
                        value: v.inflationAmount,
                        color: "#128B80",
                      },
                      {
                        label: "Future cost",
                        value: inflationFutureCost,
                        color: "#EE964B",
                      },
                    ]}
                  />
                </>
              )}

              {/* Goal Planner Results */}
              {active === "planner" && (
                <>
                  <ResultCard
                    label="Recommended target amount"
                    value={money(goalFutureTarget)}
                    featured
                    description={`Target in ${v.goalYears} years, adjusted for inflation`}
                  />

                  <div className="rounded-xl border border-[#748B75]/25 bg-white p-4">
                    <p className="mb-3 text-xs font-bold text-[#181F1C]">
                      Required investment amount
                    </p>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <div className="rounded-lg border border-[#748B75]/20 p-3">
                        <p className="text-[9px] uppercase tracking-wider text-[#748B75]">
                          Monthly
                        </p>
                        <p className="mt-1 font-bold text-[#181F1C]">
                          {money(goalSIP, true)}
                        </p>
                      </div>

                      <div className="rounded-lg border border-[#748B75]/20 p-3">
                        <p className="text-[9px] uppercase tracking-wider text-[#748B75]">
                          Yearly
                        </p>
                        <p className="mt-1 font-bold text-[#181F1C]">
                          {money(goalSIP * 12, true)}
                        </p>
                      </div>

                      <div className="rounded-lg border border-[#748B75]/20 p-3">
                        <p className="text-[9px] uppercase tracking-wider text-[#748B75]">
                          One time
                        </p>
                        <p className="mt-1 font-bold text-[#181F1C]">
                          {money(goalOneTime, true)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <ResultCard
                      label="Future value of existing investment"
                      value={money(goalExistingFuture)}
                    />

                    <ResultCard
                      label="Current goal amount"
                      value={money(v.goalAmount)}
                    />
                  </div>

                  <ResultCard
                    label="Shortfall / surplus to target amount"
                    value={money(goalGap)}
                    warning={goalGap > 0}
                    description={
                      goalGap > 0
                        ? "Additional future value required"
                        : "Your existing investment is projected to meet the target"
                    }
                  />

                  <ChartPanel
                    title="Goal funding projection"
                    subtitle="Compare your future target with existing investments."
                    items={[
                      {
                        label: "Target",
                        value: goalFutureTarget,
                        color: "#EE964B",
                      },
                      {
                        label: "Existing investment FV",
                        value: goalExistingFuture,
                        color: "#128B80",
                      },
                      {
                        label: "Remaining gap",
                        value: Math.max(0, goalGap),
                        color: "#748B75",
                      },
                    ]}
                  />
                </>
              )}

              {/* Disclaimer */}
              <div className="flex gap-3 rounded-xl border border-[#748B75]/20 bg-[#EFF9F0] p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#748B75]" />
                <p className="text-[10px] leading-5 text-[#748B75]">
                  These calculations are illustrative estimates based on
                  your inputs and assumed rates. Actual investment returns,
                  inflation, loan charges and future expenses may differ.
                  Mutual fund returns are market-linked and not guaranteed.
                  This tool is for educational purposes and is not
                  personalized financial advice.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom information */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="flex gap-4 rounded-xl border border-[#748B75]/20 bg-white p-5">
            <PiggyBank className="h-6 w-6 shrink-0 text-[#748B75]" />
            <div>
              <h3 className="text-sm font-semibold text-[#181F1C]">
                Invest consistently
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#748B75]">
                Understand the impact of regular investments and
                compounding.
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-xl border border-[#748B75]/20 bg-white p-5">
            <Wallet className="h-6 w-6 shrink-0 text-[#748B75]" />
            <div>
              <h3 className="text-sm font-semibold text-[#181F1C]">
                Borrow thoughtfully
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#748B75]">
                Estimate EMIs and understand the overall cost of borrowing.
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-xl border border-[#748B75]/20 bg-white p-5">
            <GraduationCap className="h-6 w-6 shrink-0 text-[#748B75]" />
            <div>
              <h3 className="text-sm font-semibold text-[#181F1C]">
                Plan for tomorrow
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#748B75]">
                Prepare for retirement, education and other important
                financial milestones.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
