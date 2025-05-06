import React, { useState, useEffect } from 'react';
import { IoClose, IoTrash, IoPencil, IoAdd } from 'react-icons/io5';

interface TutorialEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (tutorial: TutorialEvent) => void;
}

interface TutorialEvent {
  id: string;
  course: string;
  date: string;
  time: string;
  taName: string;
  location: string;
  zoomLink?: string;
  willRecord: boolean;
  willPostNotes: boolean;
  additionalResources?: string[];
  type: string;
}

const defaultForm: TutorialEvent = {
  id: '',
  course: '',
  date: '',
  time: '',
  taName: '',
  location: '',
  zoomLink: '',
  willRecord: false,
  willPostNotes: false,
  additionalResources: [],
  type: 'academic',
};

export default function TutorialEditModal({ isOpen, onClose }: TutorialEditModalProps) {
  const [tutorials, setTutorials] = useState<TutorialEvent[]>([]);
  const [form, setForm] = useState<TutorialEvent>({ ...defaultForm, type: 'academic' });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasZoomLink, setHasZoomLink] = useState(false);

  useEffect(() => {
    if (isOpen) fetchTutorials();
  }, [isOpen]);

  useEffect(() => {
    setHasZoomLink(!!form.zoomLink);
  }, [form]);

  const fetchTutorials = async () => {
    setLoading(true);
    const res = await fetch('/api/tutorials');
    const data = await res.json();
    setTutorials(data.tutorials || []);
    setLoading(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleZoomCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasZoomLink(e.target.checked);
    if (!e.target.checked) {
      setForm(prev => ({ ...prev, zoomLink: '' }));
    }
  };

  const handleEdit = (tutorial: TutorialEvent) => {
    setForm({ ...tutorial, additionalResources: tutorial.additionalResources || [] });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this tutorial?')) return;
    await fetch('/api/tutorials', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setTutorials(tutorials.filter(t => t.id !== id));
    // Also remove from calendar
    await syncCalendar(tutorials.filter(t => t.id !== id));
  };

  const handleAdd = () => {
    setForm(defaultForm);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedTutorials;
    if (isEditing) {
      // Update
      await fetch('/api/tutorials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, additionalResources: parseResources(form.additionalResources) }),
      });
      updatedTutorials = tutorials.map(t => t.id === form.id ? { ...form, additionalResources: parseResources(form.additionalResources) } : t);
    } else {
      // Add
      const res = await fetch('/api/tutorials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, additionalResources: parseResources(form.additionalResources) }),
      });
      const data = await res.json();
      updatedTutorials = [...tutorials, data.tutorial];
    }
    setTutorials(updatedTutorials);
    setShowForm(false);
    setForm(defaultForm);
    setIsEditing(false);
    // Sync with calendar
    await syncCalendar(updatedTutorials);
  };

  // Parse resources from string or array
  function parseResources(val: string[] | string | undefined): string[] {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return val.split(',').map(r => r.trim()).filter(Boolean);
  }

  // Sync tutorials to calendar
  async function syncCalendar(tutorials: TutorialEvent[]) {
    // Fetch current calendar events
    const res = await fetch('/api/getCalendar');
    const data = await res.json();
    let events = data.events || [];
    // Remove all tutorial events
    events = events.filter((e: any) => !e.meta || e.meta !== 'tutorial');
    // Add all tutorials as events
    const tutorialEvents = tutorials.map(t => ({
      id: t.id,
      title: `${t.course} Tutorial`,
      start: t.date,
      end: t.date,
      allDay: false,
      description: `TA: ${t.taName}\nLocation: ${t.location}\n${t.additionalResources?.length ? 'Resources: ' + t.additionalResources.join(', ') : ''}`,
      location: t.location,
      time: t.time,
      meta: 'tutorial',
    }));
    const newEvents = [...events, ...tutorialEvents];
    await fetch('/api/updateCalendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: newEvents }),
    });
  }

  // Split tutorials by type
  const academicTutorials = tutorials.filter(t => t.type === 'academic');
  const nonAcademicTutorials = tutorials.filter(t => t.type === 'non-academic');

  // Add this function to save all tutorials to the backend
  const handlePublish = async () => {
    await fetch('/api/tutorials', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tutorials),
    });
    // Optionally, show a success message or close the modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg max-w-5xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <IoClose size={24} />
        </button>
        <h2 className="text-2xl font-bold text-[#4A154B] mb-6">Manage Tutorials</h2>
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#931cf5] text-white rounded hover:bg-[#7a1ac4]"
          >
            <IoAdd /> Add Tutorial
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <h3 className="text-lg font-bold mb-2 text-[#4A154B]">Academic Tutorials</h3>
            <table className="min-w-full border border-gray-200 rounded-lg mb-8">
              <thead>
                <tr className="bg-[#931cf5] text-white">
                  <th className="px-4 py-2">Course</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">TA</th>
                  <th className="px-4 py-2">Location</th>
                  <th className="px-4 py-2">Zoom</th>
                  <th className="px-4 py-2">Resources</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {academicTutorials.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-4">No academic tutorials scheduled.</td></tr>
                )}
                {academicTutorials.map(t => (
                  <tr key={t.id} className="border-b">
                    <td className="px-4 py-2 font-semibold">{t.course}</td>
                    <td className="px-4 py-2">{t.date}</td>
                    <td className="px-4 py-2">{t.time}</td>
                    <td className="px-4 py-2">{t.taName}</td>
                    <td className="px-4 py-2">{t.location}</td>
                    <td className="px-4 py-2">
                      {t.zoomLink ? <a href={t.zoomLink} className="text-[#931cf5] underline" target="_blank" rel="noopener noreferrer">Join</a> : '-'}
                    </td>
                    <td className="px-4 py-2">
                      {t.additionalResources && t.additionalResources.length > 0 ? (
                        <ul className="list-disc pl-4">
                          {t.additionalResources.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={() => handleEdit(t)} className="text-[#931cf5] hover:text-[#7a1ac4]" title="Edit"><IoPencil /></button>
                      <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700" title="Delete"><IoTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="text-lg font-bold mb-2 text-[#4A154B]">Non-Academic Tutorials</h3>
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-[#931cf5] text-white">
                  <th className="px-4 py-2">Course</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">TA</th>
                  <th className="px-4 py-2">Location</th>
                  <th className="px-4 py-2">Zoom</th>
                  <th className="px-4 py-2">Resources</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {nonAcademicTutorials.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-4">No non-academic tutorials scheduled.</td></tr>
                )}
                {nonAcademicTutorials.map(t => (
                  <tr key={t.id} className="border-b">
                    <td className="px-4 py-2 font-semibold">{t.course}</td>
                    <td className="px-4 py-2">{t.date}</td>
                    <td className="px-4 py-2">{t.time}</td>
                    <td className="px-4 py-2">{t.taName}</td>
                    <td className="px-4 py-2">{t.location}</td>
                    <td className="px-4 py-2">
                      {t.zoomLink ? <a href={t.zoomLink} className="text-[#931cf5] underline" target="_blank" rel="noopener noreferrer">Join</a> : '-'}
                    </td>
                    <td className="px-4 py-2">
                      {t.additionalResources && t.additionalResources.length > 0 ? (
                        <ul className="list-disc pl-4">
                          {t.additionalResources.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={() => handleEdit(t)} className="text-[#931cf5] hover:text-[#7a1ac4]" title="Edit"><IoPencil /></button>
                      <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700" title="Delete"><IoTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Add/Edit Form */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div className="bg-white rounded-lg p-8 max-w-lg w-full relative">
              <button
                onClick={() => { setShowForm(false); setForm({ ...defaultForm, type: 'academic' }); setIsEditing(false); }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <IoClose size={24} />
              </button>
              <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Tutorial' : 'Add Tutorial'}</h3>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    name="type"
                    value={form.type || 'academic'}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#931cf5] focus:ring-[#931cf5]"
                    required
                  >
                    <option value="academic">Academic</option>
                    <option value="non-academic">Non-Academic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course</label>
                  <input type="text" name="course" value={form.course} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#931cf5] focus:ring-[#931cf5]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input type="date" name="date" value={form.date} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#931cf5] focus:ring-[#931cf5]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input type="text" name="time" value={form.time} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#931cf5] focus:ring-[#931cf5]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">TA Name</label>
                  <input type="text" name="taName" value={form.taName} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#931cf5] focus:ring-[#931cf5]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input type="text" name="location" value={form.location} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#931cf5] focus:ring-[#931cf5]" required />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input type="checkbox" checked={hasZoomLink} onChange={handleZoomCheckbox} /> Has Zoom Link?
                  </label>
                  {hasZoomLink && (
                    <input
                      type="text"
                      name="zoomLink"
                      value={form.zoomLink}
                      onChange={handleFormChange}
                      className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#931cf5] focus:ring-[#931cf5]"
                      placeholder="Zoom Link"
                      required={hasZoomLink}
                    />
                  )}
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input type="checkbox" name="willRecord" checked={form.willRecord} onChange={handleFormChange} /> Recording?
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input type="checkbox" name="willPostNotes" checked={form.willPostNotes} onChange={handleFormChange} /> Notes?
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Additional Resources (comma separated)</label>
                  <textarea name="additionalResources" value={Array.isArray(form.additionalResources) ? form.additionalResources.join(', ') : ''} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#931cf5] focus:ring-[#931cf5]" rows={2} />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => { setShowForm(false); setForm({ ...defaultForm, type: 'academic' }); setIsEditing(false); }} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[#931cf5] text-white rounded hover:bg-[#7a1ac4]">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="flex justify-end mt-6">
          <button
            onClick={handlePublish}
            className="px-6 py-2 bg-[#931cf5] text-white rounded hover:bg-[#7a1ac4] font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
} 