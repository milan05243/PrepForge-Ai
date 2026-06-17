import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../components/Card';
import { ListSkeleton } from '../components/Skeletons';
import { Briefcase, MapPin, DollarSign, Filter, Search, Calendar, ChevronRight, X } from 'lucide-react';

export default function Jobs({ apiBase, triggerToast }) {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedExp, setSelectedExp] = useState('');

  // Modals state
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(null);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', resume: null });
  const [submittingApply, setSubmittingApply] = useState(false);

  async function fetchJobs() {
    try {
      let url = `${apiBase}/api/jobs?`;
      if (selectedType) url += `type=${selectedType}&`;
      if (selectedExp) url += `experience=${selectedExp}&`;
      if (query) url += `query=${query}&`;

      const res = await fetch(url);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
      triggerToast('Failed to fetch jobs.', 'error');
    }
  }

  async function fetchApplications() {
    try {
      const res = await fetch(`${apiBase}/api/applications`);
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    async function initData() {
      setLoading(true);
      await Promise.all([fetchJobs(), fetchApplications()]);
      setLoading(false);
    }
    initData();
  }, [selectedType, selectedExp, query, apiBase]);

  const handleApplyChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setApplyForm(prev => ({ ...prev, resume: files[0] }));
    } else {
      setApplyForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyForm.resume) {
      triggerToast('Please upload a resume.', 'error');
      return;
    }

    setSubmittingApply(true);
    const formData = new FormData();
    formData.append('candidate_name', applyForm.name);
    formData.append('candidate_email', applyForm.email);
    formData.append('resume', applyForm.resume);

    try {
      const res = await fetch(`${apiBase}/api/jobs/${showApplyModal}/apply`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Apply failed');
      }

      triggerToast('Application submitted successfully!', 'success');
      setShowApplyModal(null);
      setApplyForm({ name: '', email: '', resume: null });
      
      // Refresh jobs list and application board
      await Promise.all([fetchJobs(), fetchApplications()]);
    } catch (err) {
      triggerToast(err.message || 'Failed to submit application', 'error');
    } finally {
      setSubmittingApply(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await fetch(`${apiBase}/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Status update failed');
      
      triggerToast(`Application status updated to ${newStatus}`, 'success');
      fetchApplications();
    } catch (err) {
      triggerToast('Failed to update application status.', 'error');
    }
  };

  const getStatusBorder = (status) => {
    if (status === 'Shortlisted') return 'border-l-4 border-l-sky-500';
    if (status === 'Interviewing') return 'border-l-4 border-l-amber-500';
    if (status === 'Offer') return 'border-l-4 border-l-emerald-500';
    return 'border-l-4 border-l-indigo-500';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Job Portal</h2>
        <p className="text-slate-400 text-sm mt-1">Explore software engineering roles, apply via resume uploads, and track hiring stages.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Panel */}
        <aside className="lg:col-span-1 space-y-6">
          <Card hoverEffect={false} className="p-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <span className="text-white font-bold flex items-center gap-2 text-sm"><Filter className="h-4 w-4" /> Filters</span>
              <button 
                onClick={() => { setSelectedType(''); setSelectedExp(''); setQuery(''); }}
                className="text-xs text-indigo-400 font-semibold hover:underline"
              >
                Reset
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-slate-300 font-semibold text-xs uppercase tracking-wider mb-2">Job Type</label>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-[#0a0d17] border border-white/10 rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="">All Types</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Intern">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold text-xs uppercase tracking-wider mb-2">Experience Level</label>
                <select 
                  value={selectedExp}
                  onChange={(e) => setSelectedExp(e.target.value)}
                  className="w-full bg-[#0a0d17] border border-white/10 rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="">All Experience</option>
                  <option value="Freshers">Freshers</option>
                  <option value="1 - 3 Years">1 - 3 Years</option>
                  <option value="2 - 5 Years">2 - 5 Years</option>
                </select>
              </div>
            </div>
          </Card>
        </aside>

        {/* Search & Listings */}
        <section className="lg:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jobs by title, company, or location..."
              className="w-full bg-[#0a0d17] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500 glass-panel"
            />
          </div>

          {loading ? (
            <ListSkeleton />
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 glass-panel rounded-xl border border-white/5 text-slate-500 text-sm">
              No jobs matching your criteria. Try adjusting your filters.
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => {
                const isApplied = applications.some(app => app.job_id === job.id);
                return (
                  <div key={job.id} className="p-6 rounded-xl glass-panel border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-500/20 transition-all bg-white/[0.01]">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white tracking-tight">{job.title}</h3>
                      <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">{job.company}</div>
                      <div className="flex flex-wrap gap-4 text-slate-400 text-xs mt-2">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                        <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {job.type} &bull; {job.experience}</span>
                        <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> {job.salary}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button 
                        onClick={() => setSelectedJob(job)}
                        className="flex-1 md:flex-initial btn btn-secondary text-xs px-4 py-2.5 rounded-lg"
                      >
                        View Details
                      </button>
                      {isApplied ? (
                        <span className="flex-1 md:flex-initial text-center bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-semibold px-4 py-2.5 rounded-lg select-none">
                          Applied
                        </span>
                      ) : (
                        <button 
                          onClick={() => setShowApplyModal(job.id)}
                          className="flex-1 md:flex-initial btn btn-primary text-xs px-4 py-2.5 rounded-lg"
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Kanban / Status Tracker Board */}
          {!loading && applications.length > 0 && (
            <div className="border-t border-white/5 pt-8 mt-12 space-y-6">
              <h3 className="text-xl font-bold text-white tracking-tight">Application Status Kanban</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['Applied', 'Shortlisted', 'Interviewing', 'Offer'].map(status => {
                  const appsInStatus = applications.filter(app => app.status === status);
                  return (
                    <div key={status} className="bg-slate-950/40 border border-white/5 rounded-xl p-4 min-h-[180px]">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 text-xs uppercase tracking-wider font-bold text-slate-400">
                        <span>{status}</span>
                        <span className="bg-white/5 text-white px-2 py-0.5 rounded-full">{appsInStatus.length}</span>
                      </div>
                      <div className="space-y-3">
                        {appsInStatus.map(app => (
                          <div key={app.id} className={`p-3 rounded-lg bg-[#0e1428] border border-white/5 text-xs ${getStatusBorder(status)}`}>
                            <div className="font-bold text-white tracking-tight">{app.job?.title || 'Job Position'}</div>
                            <div className="text-slate-400 mt-1">{app.job?.company || 'Company'}</div>
                            <select 
                              value={app.status} 
                              onChange={(e) => handleStatusChange(app.id, e.target.value)}
                              className="w-full mt-3 bg-slate-900 border border-white/10 rounded-md p-1 text-[10px] text-slate-400 focus:outline-none focus:border-indigo-500"
                            >
                              <option value="Applied">Applied</option>
                              <option value="Shortlisted">Shortlisted</option>
                              <option value="Interviewing">Interviewing</option>
                              <option value="Offer">Offer</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#090d16] border border-white/10 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-6 relative">
            <button onClick={() => setSelectedJob(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">{selectedJob.title}</h3>
              <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider">{selectedJob.company}</div>
              <div className="flex flex-wrap gap-4 text-slate-400 text-xs mt-2">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {selectedJob.location}</span>
                <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> {selectedJob.salary}</span>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <h4 className="font-bold text-white border-b border-white/5 pb-1 mb-2">Description</h4>
                <p className="leading-relaxed">{selectedJob.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-white border-b border-white/5 pb-1 mb-2">Requirements</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedJob.requirements.map((req, idx) => <li key={idx}>{req}</li>)}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white border-b border-white/5 pb-1 mb-2">Benefits</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedJob.benefits.map((ben, idx) => <li key={idx}>{ben}</li>)}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-white/5 pt-4 mt-6">
              <button onClick={() => setSelectedJob(null)} className="btn btn-secondary text-xs rounded-lg py-2 px-4">
                Close
              </button>
              {!applications.some(app => app.job_id === selectedJob.id) && (
                <button 
                  onClick={() => { setShowApplyModal(selectedJob.id); setSelectedJob(null); }}
                  className="btn btn-primary text-xs rounded-lg py-2 px-4"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Apply Form Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#090d16] border border-white/10 rounded-xl p-6 max-w-md w-full relative">
            <button onClick={() => setShowApplyModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-2">Job Application</h3>
            <p className="text-slate-400 text-xs mb-6">Apply to position by submitting contact details and resume.</p>
            
            <form onSubmit={handleApplySubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-slate-300 font-medium text-xs mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={applyForm.name}
                  onChange={handleApplyChange}
                  required
                  placeholder="Enter your name"
                  className="w-full bg-[#0a0d17] border border-white/10 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium text-xs mb-1">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={applyForm.email}
                  onChange={handleApplyChange}
                  required
                  placeholder="Enter your email"
                  className="w-full bg-[#0a0d17] border border-white/10 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium text-xs mb-1">Upload Resume (PDF only)</label>
                <input 
                  type="file" 
                  accept=".pdf"
                  required
                  onChange={handleApplyChange}
                  className="w-full bg-[#0a0d17] border border-white/10 rounded-lg p-2.5 text-white text-xs file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-white/5 file:text-indigo-400 file:cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-white/5 pt-4 mt-6">
                <button type="button" onClick={() => setShowApplyModal(null)} className="btn btn-secondary text-xs rounded-lg py-2 px-4">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submittingApply}
                  className="btn btn-accent text-xs rounded-lg py-2 px-4 disabled:opacity-50"
                >
                  {submittingApply ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
