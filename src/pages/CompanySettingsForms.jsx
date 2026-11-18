import React, { useState } from 'react';
import AdminRecordForm from './AdminRecordForm';

const SECTIONS = [
  {
    key: 'profile',
    title: 'Company profile',
    description: 'Manage the company name, overview, mission, vision, and values.',
    paths: ['slug', 'subtitle', 'title', 'name', 'description', 'mission', 'vision', 'values'],
    keys: ['slug', 'subtitle', 'title', 'name', 'description', 'mission', 'vision', 'values'],
  },
  {
    key: 'contact',
    title: 'Contact and branding',
    description: 'Manage primary contact details, WhatsApp, and company imagery.',
    paths: ['contact'],
    keys: ['contact'],
  },
  {
    key: 'navigation',
    title: 'Navigation',
    description: 'Manage the website navigation links and their order.',
    paths: ['navigation'],
    keys: ['navigation'],
  },
  {
    key: 'socials',
    title: 'Social links',
    description: 'Manage social media links and their display icons.',
    paths: ['socials'],
    keys: ['socials'],
  },
];

function getSectionFields(fields, section) {
  return fields.filter((field) => section.paths.some((path) => (
    field.path === path || field.path.startsWith(`${path}.`)
  )));
}

function getSectionValue(value, section) {
  return Object.fromEntries(section.keys
    .filter((key) => Object.hasOwn(value, key))
    .map((key) => [key, value[key]]));
}

function mergeSectionValue(value, section, sectionValue) {
  return { ...value, ...getSectionValue(sectionValue, section) };
}

export default function CompanySettingsForms({ fields, references, value, saving, onSave }) {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].key);
  const [drafts, setDrafts] = useState(() => Object.fromEntries(
    SECTIONS.map((section) => [section.key, getSectionValue(value, section)])
  ));

  function saveSection(event, section) {
    event.preventDefault();
    const sectionValue = drafts[section.key];
    onSave(mergeSectionValue(value, section, sectionValue));
  }

  return (
    <div>
      <nav aria-label="Company settings sections" className="mb-5 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {SECTIONS.map((section) => (
          <button
            key={section.key}
            type="button"
            aria-pressed={activeSection === section.key}
            onClick={() => setActiveSection(section.key)}
            className={`px-3 py-2 text-sm font-semibold transition ${
              activeSection === section.key
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {section.title}
          </button>
        ))}
      </nav>

      {SECTIONS.map((section) => {
        const sectionFields = getSectionFields(fields, section);
        if (!sectionFields.length || activeSection !== section.key) return null;

        return (
          <form key={section.key} onSubmit={(event) => saveSection(event, section)} className="space-y-5">
            <header className="border-b border-slate-200 pb-4">
              <h4 className="text-lg font-semibold text-slate-900">{section.title}</h4>
              <p className="mt-1 text-sm text-slate-500">{section.description}</p>
            </header>
            <AdminRecordForm
              fields={sectionFields}
              references={references}
              value={drafts[section.key]}
              onChange={(nextValue) => setDrafts((current) => ({
                ...current,
                [section.key]: nextValue,
              }))}
            />
            <footer className="flex justify-end border-t border-slate-200 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-wait disabled:opacity-50"
              >
                {saving ? 'Saving…' : `Save ${section.title.toLowerCase()}`}
              </button>
            </footer>
          </form>
        );
      })}
    </div>
  );
}
