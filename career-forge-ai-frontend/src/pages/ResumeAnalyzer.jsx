import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../components/Card';
import { Upload, HelpCircle, FileText, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

export default function ResumeAnalyzer({ apiBase, triggerToast }) {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState('Fullstack');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      triggerToast('Resume PDF loaded successfully!', 'success');
    } else {
      triggerToast('Please upload a valid PDF format.', 'error');
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      triggerToast('Please select a resume file first.', 'error');
      return;
    }

    setAnalyzing(true);
    setResults(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_role', role);

    try {
      const res = await fetch(`${apiBase}/api/ai/resume-analyzer`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to parse resume');
      }

      const data = await res.json();
      setResults(data);
      triggerToast('ATS analysis completed successfully!', 'success');
    } catch (err) {
      console.error(err);
      triggerToast(err.message || 'ATS analysis failed.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  // Color matching based on ATS score
  const getScoreColor = (score) => {
    if (score >= 75) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 50) return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">AI Resume Analyzer</h2>
        <p className="text-slate-400 text-sm mt-1">Check your resume's ATS compatibility score, detect gaps, and get recommendations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form Box */}
        <div className="lg:col-span-1">
          <Card hoverEffect={false}>
            <CardHeader>
              <CardTitle>Upload Resume</CardTitle>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleUploadSubmit} className="space-y-6">
                <div>
                  <label className="block text-slate-300 font-medium text-sm mb-2">Target Job Profile</label>
                  <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#0a0d17] border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Frontend">Frontend Engineer</option>
                    <option value="Backend">Backend Developer</option>
                    <option value="Fullstack">Fullstack Developer</option>
                    <option value="Data Science">Data Scientist / AI Engineer</option>
                    <option value="DevOps">DevOps / Cloud Specialist</option>
                  </select>
                </div>

                <div className="relative group border-2 border-dashed border-white/10 hover:border-indigo-500/50 rounded-xl p-8 text-center transition-all bg-white/[0.01]">
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-3 bg-white/5 rounded-full text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                      <Upload className="h-6 w-6" />
                    </div>
                    {file ? (
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-white break-all max-w-[200px]">{file.name}</p>
                        <p className="text-xs text-slate-400">PDF Document ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-white">Choose a file or drag here</p>
                        <p className="text-xs text-slate-400 mt-1">Accepts text-based PDF formats</p>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={analyzing || !file}
                  className="w-full btn btn-primary flex items-center justify-center gap-2 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {analyzing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing Resume...
                    </>
                  ) : 'Run ATS Evaluation'}
                </button>
              </form>
            </CardBody>
          </Card>
        </div>

        {/* ATS Results Visualizer */}
        <div className="lg:col-span-2">
          {analyzing && (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center space-y-4 glass-panel rounded-xl border border-white/5">
              <div className="relative flex items-center justify-center">
                <div className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-indigo-400 opacity-20"></div>
                <FileText className="h-10 w-10 text-indigo-400 animate-bounce-slow" />
              </div>
              <p className="text-sm font-semibold text-white animate-pulse-slow">Extracting structures, skills, and formatting data...</p>
            </div>
          )}

          {!analyzing && !results && (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center space-y-3 glass-panel rounded-xl border border-white/5 text-slate-500">
              <FileText className="h-12 w-12" />
              <p className="text-sm">Upload your PDF resume to start the evaluation dashboard.</p>
            </div>
          )}

          {results && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
              {/* ATS Score Dial Card */}
              <Card hoverEffect={false} className="md:col-span-1 flex flex-col items-center justify-center text-center py-8">
                <CardHeader className="border-none pb-0">
                  <CardTitle className="text-sm text-slate-400 font-bold uppercase tracking-wide">ATS Fit Score</CardTitle>
                </CardHeader>
                <CardBody className="flex flex-col items-center justify-center mt-4">
                  <div className={`h-36 w-36 rounded-full border-4 border-dashed flex items-center justify-center ${getScoreColor(results.ats_score)}`}>
                    <span className="text-5xl font-black">{results.ats_score}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-semibold mt-4">Profile: {role}</div>
                </CardBody>
              </Card>

              {/* Skills breakdown */}
              <div className="md:col-span-2 space-y-6">
                <Card hoverEffect={false}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-indigo-400" /> Extracted Skills
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    {results.extracted_skills.length === 0 ? (
                      <p className="text-xs text-slate-500">No matching technical skills extracted.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {results.extracted_skills.map((skill, idx) => (
                          <span key={idx} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>

                <Card hoverEffect={false}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm text-slate-300">
                      <AlertTriangle className="h-4 w-4 text-amber-400" /> Missing Target Skills
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    {results.missing_skills.length === 0 ? (
                      <p className="text-xs text-emerald-400">Perfect match! No critical missing skills detected for {role}.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {results.missing_skills.map((skill, idx) => (
                          <span key={idx} className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>

                <Card hoverEffect={false}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm text-slate-300">
                      <Lightbulb className="h-4 w-4 text-amber-400" /> Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <ul className="space-y-3">
                      {results.suggestions.map((sug, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-slate-300">
                          <span className="text-indigo-400 font-bold">•</span>
                          <span>{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
