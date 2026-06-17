import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../components/Card';
import { BookOpen, Award, CheckCircle, XCircle } from 'lucide-react';

const PREP_DATA = {
  dbms: {
    title: "Database Management Systems (DBMS)",
    notes: [
      { topic: "ACID Properties", details: "Atomicity (all or nothing), Consistency (preserves database integrity), Isolation (transactions run independently), Durability (committed changes survive crashes)." },
      { topic: "Normalization", details: "1NF: Atomic values. 2NF: 1NF + no partial key dependency. 3NF: 2NF + no transitive key dependency. BCNF: X->Y implies X must be a super key." },
      { topic: "SQL Joins", details: "Inner Join (matching keys), Left Join (all left + matches from right), Full Outer (all records, fills missing with nulls)." }
    ],
    quizzes: [
      { id: "db-q1", question: "Which normal form deals with removing partial dependencies?", options: ["1NF", "2NF", "3NF", "BCNF"], correct: 1, explanation: "A relation is in 2NF if it is in 1NF and every non-prime attribute is fully functionally dependent on the primary key, removing partial dependencies." },
      { id: "db-q2", question: "What does Isolation guarantee in ACID transactions?", options: ["Permanency of committed changes", "Concurrent transactions run without interference", "Integrity of states", "All actions succeed or fail together"], correct: 1, explanation: "Isolation ensures that the execution of concurrent transactions does not lead to inconsistent states, simulating sequential execution." }
    ]
  },
  os: {
    title: "Operating Systems (OS)",
    notes: [
      { topic: "Paging", details: "A memory management scheme that eliminates physical fragmentation by dividing memory into frames (RAM) and pages (virtual space)." },
      { topic: "Deadlocks", details: "Occurs when processes cannot proceed because they hold resources while waiting for other held resources. Required conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait." },
      { topic: "Process vs Thread", details: "Processes are independent address spaces with their own memory. Threads are execution contexts within a process sharing its memory space." }
    ],
    quizzes: [
      { id: "os-q1", question: "Which of the following is NOT a necessary condition for deadlock?", options: ["Hold and Wait", "No Preemption", "Circular Wait", "Preemption"], correct: 3, explanation: "The four deadlock conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Preemption breaks deadlocks." }
    ]
  },
  cn: {
    title: "Computer Networks (CN)",
    notes: [
      { topic: "TCP vs UDP", details: "TCP is connection-oriented, reliable, orders packets (HTTP, SMTP). UDP is connectionless, fast, unreliable, doesn't guarantee order (Streaming, DNS)." },
      { topic: "OSI Layers", details: "Physical, Data Link, Network (IP), Transport (TCP/UDP), Session, Presentation, Application (HTTP)." }
    ],
    quizzes: [
      { id: "cn-q1", question: "At which layer of the OSI model does TCP protocol operate?", options: ["Network Layer", "Transport Layer", "Application Layer", "Data Link Layer"], correct: 1, explanation: "TCP (Transmission Control Protocol) and UDP operate at the Transport Layer of the OSI model." }
    ]
  },
  oops: {
    title: "Object-Oriented Programming (OOPS)",
    notes: [
      { topic: "Polymorphism", details: "Method Overloading (Compile-time: same method name, different signatures) and Method Overriding (Runtime: parent class method redefined in child)." },
      { topic: "Abstraction", details: "Hiding implementation details and exposing only interfaces (using abstract classes/interfaces)." }
    ],
    quizzes: [
      { id: "oop-q1", question: "What is Runtime Polymorphism achieved through?", options: ["Method Overloading", "Method Overriding", "Encapsulation", "Multiple Inheritance"], correct: 1, explanation: "Method Overriding allows a subclass to provide a specific implementation of a method already defined in its parent, supporting runtime polymorphism." }
    ]
  }
};

export default function InterviewPrep({ apiBase, triggerToast }) {
  const [activeTab, setActiveTab] = useState('dbms');
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { qId: selectedIndex }
  const [scoreLogged, setScoreLogged] = useState({}); // { qId: true }

  const currentSubject = PREP_DATA[activeTab];

  const handleAnswerClick = async (quiz, optionIdx) => {
    if (selectedAnswers[quiz.id] !== undefined) return; // Answered

    // Set answer
    setSelectedAnswers(prev => ({ ...prev, [quiz.id]: optionIdx }));

    // Send score to backend
    const isCorrect = optionIdx === quiz.correct;
    try {
      await fetch(`${apiBase}/api/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: currentSubject.title,
          correct: isCorrect ? 1 : 0,
          total: 1
        })
      });
      
      if (isCorrect) {
        triggerToast('Correct Answer!', 'success');
      } else {
        triggerToast('Incorrect Answer.', 'error');
      }
    } catch (err) {
      console.error("Failed to log score", err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-sm">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Interview Preparation Hub</h2>
        <p className="text-slate-400 text-xs mt-1">Review core CS subjects, read quick cheat sheets, and solve practice questions.</p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-white/5 gap-4 overflow-x-auto pb-1">
        {Object.keys(PREP_DATA).map(key => (
          <button 
            key={key}
            onClick={() => setActiveTab(key)}
            className={`py-3 px-4 border-b-2 font-bold transition-all text-xs uppercase tracking-wider ${activeTab === key ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            {PREP_DATA[key].title.split('(')[0].trim()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revision Notes Cheat Sheet */}
        <div className="lg:col-span-1 space-y-4">
          <Card hoverEffect={false}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-indigo-400" /> Revision Notes</CardTitle>
            </CardHeader>
            <CardBody className="space-y-5">
              {currentSubject.notes.map((note, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="font-bold text-white tracking-tight text-xs">{note.topic}</div>
                  <p className="text-slate-400 leading-relaxed text-xs">{note.details}</p>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* Practice MCQs */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-400" /> Practice Challenges
          </h3>

          <div className="space-y-6">
            {currentSubject.quizzes.map((quiz, idx) => {
              const selected = selectedAnswers[quiz.id];
              const isAnswered = selected !== undefined;
              
              return (
                <Card key={quiz.id} hoverEffect={false} className="p-6">
                  <div className="font-semibold text-white mb-4 leading-relaxed">{idx + 1}. {quiz.question}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {quiz.options.map((opt, oIdx) => {
                      let btnBg = 'bg-white/[0.02] border-white/10 hover:bg-white/5';
                      let textStyle = 'text-slate-300';
                      
                      if (isAnswered) {
                        if (oIdx === quiz.correct) {
                          btnBg = 'bg-emerald-500/10 border-emerald-500/30';
                          textStyle = 'text-emerald-400 font-bold';
                        } else if (oIdx === selected) {
                          btnBg = 'bg-rose-500/10 border-rose-500/30';
                          textStyle = 'text-rose-400 font-bold';
                        } else {
                          btnBg = 'bg-white/[0.01] border-white/5 opacity-50';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isAnswered}
                          onClick={() => handleAnswerClick(quiz, oIdx)}
                          className={`w-full text-left p-3.5 border rounded-lg text-xs transition-all ${btnBg} ${textStyle}`}
                        >
                          <span className="inline-block w-5 font-bold uppercase mr-1">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation block */}
                  {isAnswered && (
                    <div className="mt-4 p-4 border-l-4 border-l-indigo-500 bg-indigo-500/5 rounded-r-lg text-slate-400 leading-relaxed text-xs animate-fade-in">
                      <div className="font-bold text-white mb-1 tracking-tight flex items-center gap-1">
                        {selected === quiz.correct 
                          ? <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Correct</span>
                          : <span className="text-rose-400 flex items-center gap-1"><XCircle className="h-4 w-4" /> Incorrect</span>
                        }
                      </div>
                      {quiz.explanation}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
