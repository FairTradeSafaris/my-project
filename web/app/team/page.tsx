export const revalidate = 60;

import { client } from "@/lib/sanity";
import type { TeamMember } from "@/types/teamMember";

export default async function TeamPage() {
  const team: TeamMember[] = await client.fetch(`
    *[_type == "teamMember"] | order(_createdAt asc){
      _id,
      name,
      position,
      email,
      linkedin,
      "image": image.asset->url,
      bio
    }
  `);

  return (
    <main className="bg-[#fdf8f3] text-black min-h-screen">
      {/* Hero Section with Line Art */}
      <section className="relative">
        <div
          className="relative bg-cover bg-center min-h-[500px] flex items-center justify-start px-6"
          style={{ backgroundImage: `url('/sunset-safari.webp')` }}
        >
          <div className="absolute inset-0 bg-black/60 z-0" />
          <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-12 items-center">
            <div className="p-0 md:p-0 max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Meet the Team
              </h1>
              <p className="text-base text-white/90 leading-relaxed">
                The humans behind the journeys — planners, storytellers, and
                change-makers with a shared mission.
              </p>
            </div>
            <div className="hidden md:block w-1/2">
              <img
                src="/line-art-team.png"
                alt="Team Line Art"
                className="w-full h-auto opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Subheading */}
      <section className="text-center max-w-2xl mx-auto px-6 pt-12">
        <h2 className="text-xl font-medium text-[#3c2a1e]">
          Purpose-Driven. People-Led.
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Our core team ensures every Fair Trade Safari is crafted with passion,
          ethics, and excellence. Get to know us.
        </p>
      </section>

      {/* Team Layout Options */}
      <section className="max-w-6xl mx-auto px-6 py-24 space-y-24">
        {team.length > 0 && (
          <>
            {/* Layout Option 1: Side-by-Side */}
            <section>
              <h3 className="text-2xl font-bold text-[#3c2a1e] border-b pb-2">
                Layout Option 1: Side-by-Side
              </h3>
              <div className="space-y-16">
                {team.map((member) => (
                  <div
                    key={member._id}
                    className="flex flex-col md:flex-row gap-6 items-center"
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-40 h-40 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-xl font-bold text-[#3c2a1e]">
                        {member.name}
                      </h4>
                      <p className="text-sm text-[#7a5c3e]">
                        {member.position}
                      </p>
                      <p className="text-gray-700 mt-2">
                        {member.bio?.[0]?.children?.[0]?.text ||
                          "Short intro goes here."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Layout Option 2: Alternating Left/Right */}
            <section>
              <h3 className="text-2xl font-bold text-[#3c2a1e] border-b pb-2">
                Layout Option 2: Alternating Image Side
              </h3>
              <div className="space-y-16">
                {team.map((member, i) => (
                  <div
                    key={member._id}
                    className={`flex flex-col md:flex-row ${i % 2 === 1 ? "md:flex-row-reverse" : ""} gap-6 items-center`}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-40 h-40 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-xl font-bold text-[#3c2a1e]">
                        {member.name}
                      </h4>
                      <p className="text-sm text-[#7a5c3e]">
                        {member.position}
                      </p>
                      <p className="text-gray-700 mt-2">
                        {member.bio?.[0]?.children?.[0]?.text ||
                          "Short intro goes here."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Layout Option 3: Grid */}
            <section>
              <h3 className="text-2xl font-bold text-[#3c2a1e] border-b pb-2">
                Layout Option 3: Grid
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
                {team.map((member) => (
                  <div key={member._id} className="text-center">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
                    />
                    <h4 className="text-lg font-bold text-[#3c2a1e]">
                      {member.name}
                    </h4>
                    <p className="text-sm text-[#7a5c3e]">{member.position}</p>
                    <p className="text-gray-600 text-sm mt-2">
                      {member.bio?.[0]?.children?.[0]?.text ||
                        "Short intro goes here."}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Layout Option 4: Full-width bio blocks */}
            <section>
              <h3 className="text-2xl font-bold text-[#3c2a1e] border-b pb-2">
                Layout Option 4: Full-width Bio Blocks
              </h3>
              <div className="space-y-12">
                {team.map((member) => (
                  <div
                    key={member._id}
                    className="bg-white shadow-md rounded-xl p-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-32 h-32 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="text-xl font-bold text-[#3c2a1e]">
                          {member.name}
                        </h4>
                        <p className="text-sm text-[#7a5c3e]">
                          {member.position}
                        </p>
                        <p className="text-gray-700 mt-2 text-sm leading-relaxed">
                          {member.bio?.[0]?.children?.[0]?.text ||
                            "Short intro goes here."}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Layout Option 5: Card with background */}
            <section>
              <h3 className="text-2xl font-bold text-[#3c2a1e] border-b pb-2">
                Layout Option 5: Card with Background
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                {team.map((member) => (
                  <div
                    key={member._id}
                    className="bg-gradient-to-br from-[#f8efe5] to-[#fdf8f3] rounded-xl p-6 shadow border"
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
                    />
                    <h4 className="text-center text-xl font-semibold text-[#3c2a1e]">
                      {member.name}
                    </h4>
                    <p className="text-center text-sm text-[#7a5c3e] mb-2">
                      {member.position}
                    </p>
                    <p className="text-sm text-gray-700 text-center">
                      {member.bio?.[0]?.children?.[0]?.text ||
                        "Short intro goes here."}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Layout Option 6: Overlay on Image Hover */}
            <section>
              <h3 className="text-2xl font-bold text-[#3c2a1e] border-b pb-2">
                Layout Option 6: Overlay on Image Hover
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                {team.map((member) => (
                  <div
                    key={member._id}
                    className="relative group overflow-hidden rounded-xl shadow-md"
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-300 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-center items-center text-white p-6">
                      <h4 className="text-xl font-semibold">{member.name}</h4>
                      <p className="text-sm mb-2">{member.position}</p>
                      <p className="text-xs text-center">
                        {member.bio?.[0]?.children?.[0]?.text ||
                          "Short intro goes here."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Layout Option 7: Two Column Split */}
            <section>
              <h3 className="text-2xl font-bold text-[#3c2a1e] border-b pb-2">
                Layout Option 7: Two Column Split
              </h3>
              <div className="grid md:grid-cols-2 gap-10">
                {team.map((member) => (
                  <div
                    key={member._id}
                    className="flex gap-6 items-start border-b pb-6"
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div>
                      <h4 className="text-lg font-bold text-[#3c2a1e]">
                        {member.name}
                      </h4>
                      <p className="text-sm text-[#7a5c3e]">
                        {member.position}
                      </p>
                      <p className="text-sm text-gray-700 mt-2">
                        {member.bio?.[0]?.children?.[0]?.text ||
                          "Short intro goes here."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Layout Option 8: Fullscreen Stacked */}
            <section>
              <h3 className="text-2xl font-bold text-[#3c2a1e] border-b pb-2">
                Layout Option 8: Fullscreen Stacked
              </h3>
              <div className="space-y-24">
                {team.map((member) => (
                  <div
                    key={member._id}
                    className="flex flex-col items-center text-center"
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-40 h-40 rounded-full object-cover mb-4"
                    />
                    <h4 className="text-2xl font-bold text-[#3c2a1e]">
                      {member.name}
                    </h4>
                    <p className="text-sm text-[#7a5c3e]">{member.position}</p>
                    <p className="text-base text-gray-700 max-w-xl mt-4">
                      {member.bio?.[0]?.children?.[0]?.text ||
                        "Short intro goes here."}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-[#3c2a1e] border-b pb-2">
                Layout Option 9: Accordion Bios
              </h3>
              <div className="space-y-4">
                {team.map((member) => (
                  <details
                    key={member._id}
                    className="bg-white rounded-md shadow p-4 group"
                  >
                    <summary className="cursor-pointer font-semibold text-[#3c2a1e] flex items-center gap-4">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span>
                        {member.name} —{" "}
                        <span className="text-sm text-[#7a5c3e]">
                          {member.position}
                        </span>
                      </span>
                    </summary>
                    <div className="mt-3 text-sm text-gray-700 leading-relaxed">
                      {member.bio?.[0]?.children?.[0]?.text ||
                        "Short intro goes here."}
                    </div>
                  </details>
                ))}
              </div>
            </section>
            <section>
              <h3 className="text-2xl font-bold text-[#3c2a1e] border-b pb-2">
                Layout Option 10: Highlighted Cards
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                {team.map((member) => (
                  <div
                    key={member._id}
                    className="relative bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="h-32 bg-[#ece1d4]"></div>
                    <div className="p-6 -mt-12 relative z-10">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white mx-auto"
                      />
                      <h4 className="text-center text-lg font-semibold mt-4 text-[#3c2a1e]">
                        {member.name}
                      </h4>
                      <p className="text-center text-sm text-[#7a5c3e]">
                        {member.position}
                      </p>
                      <p className="text-sm text-gray-600 text-center mt-2">
                        {member.bio?.[0]?.children?.[0]?.text ||
                          "Short intro goes here."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            {/* Layout Option 9: Horizontal Scroll Cards */}
            <section>
              <h3 className="text-2xl font-bold text-[#3c2a1e] border-b pb-2">
                Layout Option 11: Horizontal Scroll Cards
              </h3>
              <div className="flex space-x-6 overflow-x-auto pb-4">
                {team.map((member) => (
                  <div
                    key={member._id}
                    className="min-w-[250px] bg-white rounded-xl shadow-md p-4 flex-shrink-0 text-center"
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 object-cover rounded-full mx-auto mb-3"
                    />
                    <h4 className="text-lg font-semibold text-[#3c2a1e]">
                      {member.name}
                    </h4>
                    <p className="text-sm text-[#7a5c3e]">{member.position}</p>
                    <p className="text-xs text-gray-600 mt-2">
                      {member.bio?.[0]?.children?.[0]?.text ||
                        "Short intro goes here."}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Layout Option 10: Accordion Bios */}
            <section>
              <h3 className="text-2xl font-bold text-[#3c2a1e] border-b pb-2">
                Layout Option 12: Accordion Bios
              </h3>
              <div className="space-y-4">
                {team.map((member) => (
                  <details
                    key={member._id}
                    className="bg-white rounded-md shadow p-4 group"
                  >
                    <summary className="cursor-pointer font-semibold text-[#3c2a1e] flex items-center gap-4">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span>
                        {member.name} —{" "}
                        <span className="text-sm text-[#7a5c3e]">
                          {member.position}
                        </span>
                      </span>
                    </summary>
                    <div className="mt-3 text-sm text-gray-700 leading-relaxed">
                      {member.bio?.[0]?.children?.[0]?.text ||
                        "Short intro goes here."}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {/* Layout Option 11: Flip Card on Hover */}
            <section>
              <h3 className="text-2xl font-bold text-[#3c2a1e] border-b pb-2">
                Layout Option 13: Flip Card on Hover
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 perspective">
                {team.map((member) => (
                  <div
                    key={member._id}
                    className="group relative w-full h-64 [transform-style:preserve-3d] transition-transform duration-500 hover:rotate-y-180"
                  >
                    <div className="absolute w-full h-full backface-hidden bg-white shadow rounded-xl flex flex-col items-center justify-center text-center p-4">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-20 h-20 object-cover rounded-full mb-3"
                      />
                      <h4 className="text-lg font-semibold text-[#3c2a1e]">
                        {member.name}
                      </h4>
                      <p className="text-sm text-[#7a5c3e]">
                        {member.position}
                      </p>
                    </div>
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-[#fdf8f3] shadow rounded-xl p-4 text-sm text-gray-700 flex items-center justify-center">
                      {member.bio?.[0]?.children?.[0]?.text ||
                        "Short intro goes here."}
                    </div>
                  </div>
                ))}
              </div>
            </section>
            {/* Layout Option 14: Masonry Grid */}
            <section>
              <h3 className="text-2xl font-bold text-[#3c2a1e] border-b pb-2">
                Layout Option 14: Masonry Grid
              </h3>
              <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
                {team.map((member) => (
                  <div
                    key={member._id}
                    className="bg-white rounded-lg shadow-md p-4 break-inside-avoid"
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <h4 className="text-lg font-bold text-[#3c2a1e]">
                      {member.name}
                    </h4>
                    <p className="text-sm text-[#7a5c3e]">{member.position}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {member.bio?.[0]?.children?.[0]?.text ||
                        "Short intro goes here."}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Layout Option 15: Grouped by Role */}
            <section>
              <h3 className="text-2xl font-bold text-[#3c2a1e] border-b pb-2">
                Layout Option 15: Grouped by Role
              </h3>
              {Array.from(new Set(team.map((m) => m.position))).map((role) => (
                <div key={role} className="mb-10">
                  <h4 className="text-xl font-semibold text-[#5a3e2b] mb-4">
                    {role}
                  </h4>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {team
                      .filter((m) => m.position === role)
                      .map((member) => (
                        <div
                          key={member._id}
                          className="bg-white shadow rounded-lg p-4 text-center"
                        >
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-20 h-20 mx-auto rounded-full object-cover mb-2"
                          />
                          <h5 className="font-bold text-[#3c2a1e]">
                            {member.name}
                          </h5>
                          <p className="text-xs text-gray-600">
                            {member.bio?.[0]?.children?.[0]?.text ||
                              "Short intro goes here."}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </section>

            {/* Layout Option 16: Sticky Sidebar Bio */}
            <section>
              <h3 className="text-2xl font-bold text-[#3c2a1e] border-b pb-2">
                Layout Option 16: Sticky Sidebar Bio
              </h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="md:col-span-1 sticky top-24 self-start">
                  <ul className="space-y-2">
                    {team.map((member, idx) => (
                      <li key={member._id}>
                        <a
                          href={`#team-${idx}`}
                          className="text-[#3c2a1e] hover:underline"
                        >
                          {member.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-3 space-y-16">
                  {team.map((member, idx) => (
                    <div
                      id={`team-${idx}`}
                      key={member._id}
                      className="bg-white rounded-lg shadow p-6"
                    >
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-32 h-32 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="text-xl font-bold text-[#3c2a1e]">
                            {member.name}
                          </h4>
                          <p className="text-sm text-[#7a5c3e]">
                            {member.position}
                          </p>
                          <p className="text-sm text-gray-700 mt-2">
                            {member.bio?.[0]?.children?.[0]?.text ||
                              "Short intro goes here."}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
