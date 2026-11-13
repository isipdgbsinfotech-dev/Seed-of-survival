import { ExternalLink } from 'lucide-react';
import {
  DEVELOPMENT_TEAM_INFO,
  INSIGHTS_SUMMARY,
  PROJECT_MEMBERS,
  PROJECT_OVERVIEW_ITEMS,
  REFERENCE_SOURCES,
} from '../../data/seedsOfSurvivalData';

export function InsightsProjectView() {
  return (
    <div className="space-y-6">
      {/* Developed By Attribution Card */}
      <section
        aria-label="Developed by team information"
        className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="text-xs font-medium text-[#14452F]">
            Developed By · {DEVELOPMENT_TEAM_INFO.group}
          </div>
          <h2 className="font-display text-lg font-bold text-slate-900">
            {DEVELOPMENT_TEAM_INFO.courseSection} — {DEVELOPMENT_TEAM_INFO.group}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 text-xs sm:text-sm pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div>
            <div className="text-xs text-slate-500">Group Leader</div>
            <div className="font-semibold text-slate-900 mt-0.5">
              {DEVELOPMENT_TEAM_INFO.leader}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Members</div>
            <div className="font-semibold text-slate-900 mt-0.5">
              {DEVELOPMENT_TEAM_INFO.members.join(', ')}
            </div>
          </div>
        </div>
      </section>

      {/* Insights & Recommendation Summary Table */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="font-display text-base font-semibold text-slate-900">
            Insights &amp; Recommendation Summary
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Core findings and actionable interventions derived from the El Niño agricultural datasets
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-[#14452F] text-white text-xs font-semibold">
                <th scope="col" className="px-4 py-3 whitespace-nowrap">
                  Topic
                </th>
                <th scope="col" className="px-4 py-3">
                  Key Findings
                </th>
                <th scope="col" className="px-4 py-3">
                  Recommendations / Actions Needed
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
              {INSIGHTS_SUMMARY.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap align-top">
                    {row.number}. {row.topic} ({row.headlineMetric})
                  </td>
                  <td className="px-4 py-3 text-slate-700 leading-relaxed align-top">
                    {row.keyFindings}
                  </td>
                  <td className="px-4 py-3 text-slate-800 font-medium leading-relaxed align-top">
                    {row.recommendations}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Project Overview & Research Team */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <section className="xl:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h2 className="font-display text-base font-semibold text-slate-900">
              Seeds of Survival: Project Overview
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Executive summary of study scope and primary quantitative benchmarks
            </p>
          </div>
          <div className="divide-y divide-slate-200 text-xs sm:text-sm">
            {PROJECT_OVERVIEW_ITEMS.map((item) => (
              <div
                key={item.part}
                className="px-5 py-3 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4"
              >
                <div className="sm:col-span-4 font-semibold text-slate-900">
                  {item.part}
                </div>
                <div className="sm:col-span-8 text-slate-700 leading-relaxed">
                  {item.details}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="xl:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h2 className="font-display text-base font-semibold text-slate-900">
              Project Members &amp; Roles
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Analytics, data validation, and dashboard engineering contributors
            </p>
          </div>
          <div className="divide-y divide-slate-200 text-xs sm:text-sm">
            {PROJECT_MEMBERS.map((member) => (
              <div key={member.name} className="px-5 py-3.5 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-slate-900">{member.name}</span>
                  <span className="text-xs font-medium text-[#14452F]">{member.role}</span>
                </div>
                <p className="text-xs text-slate-600">{member.responsibility}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Data Sources & Official References */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="font-display text-base font-semibold text-slate-900">
            Data Sources &amp; Official References
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Primary Philippine government and agricultural research repositories
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#14452F] text-white text-xs font-semibold">
                <th scope="col" className="px-4 py-3">
                  Source
                </th>
                <th scope="col" className="px-4 py-3">
                  Report Name
                </th>
                <th scope="col" className="px-4 py-3">
                  Official URL
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
              {REFERENCE_SOURCES.map((ref) => (
                <tr key={ref.id} className="h-11 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2.5 font-medium text-slate-900 whitespace-nowrap">
                    {ref.source}
                  </td>
                  <td className="px-4 py-2.5 text-slate-700 whitespace-nowrap">
                    {ref.reportName}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <a
                      href={ref.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#14452F] font-medium hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14452F]"
                    >
                      <span>{ref.officialUrl}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
