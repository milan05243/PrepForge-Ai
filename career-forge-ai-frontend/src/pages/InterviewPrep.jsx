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
      { id: "db-q2", question: "What does Isolation guarantee in ACID transactions?", options: ["Permanency of committed changes", "Concurrent transactions run without interference", "Integrity of states", "All actions succeed or fail together"], correct: 1, explanation: "Isolation ensures that the execution of concurrent transactions does not lead to inconsistent states, simulating sequential execution." },
      {
  id: "db-q3",
  question: "Which SQL command is used to remove all records from a table but keep the table structure?",
  options: ["DELETE", "DROP", "TRUNCATE", "REMOVE"],
  correct: 2,
  explanation: "TRUNCATE removes all rows from a table while preserving the table structure."
},
{
  id: "db-q4",
  question: "Which key uniquely identifies a record in a relation?",
  options: ["Foreign Key", "Candidate Key", "Primary Key", "Composite Key"],
  correct: 2,
  explanation: "A Primary Key uniquely identifies each tuple (record) in a relation."
},
{
  id: "db-q5",
  question: "Which normal form eliminates transitive dependency?",
  options: ["1NF", "2NF", "3NF", "BCNF"],
  correct: 2,
  explanation: "Third Normal Form (3NF) removes transitive dependencies."
},
{
  id: "db-q6",
  question: "What does SQL stand for?",
  options: ["Structured Query Language", "Simple Query Language", "Sequential Query Language", "System Query Language"],
  correct: 0,
  explanation: "SQL stands for Structured Query Language."
},
{
  id: "db-q7",
  question: "Which join returns all rows when there is a match in either table?",
  options: ["Inner Join", "Left Join", "Right Join", "Full Outer Join"],
  correct: 3,
  explanation: "FULL OUTER JOIN returns all rows from both tables and fills unmatched values with NULL."
},
{
  id: "db-q8",
  question: "Which indexing structure is commonly used in databases?",
  options: ["B-Tree", "AVL Tree", "Heap", "Trie"],
  correct: 0,
  explanation: "B-Tree indexes are widely used because they support efficient insertion, deletion, and search."
},
{
  id: "db-q9",
  question: "Which ACID property ensures committed transactions survive system failures?",
  options: ["Atomicity", "Consistency", "Isolation", "Durability"],
  correct: 3,
  explanation: "Durability guarantees that committed transactions are permanently stored."
},
{
  id: "db-q10",
  question: "Which SQL clause is used to filter groups?",
  options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
  correct: 1,
  explanation: "HAVING filters groups created using GROUP BY."
}
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
      { id: "os-q1", question: "Which of the following is NOT a necessary condition for deadlock?", options: ["Hold and Wait", "No Preemption", "Circular Wait", "Preemption"], correct: 3, explanation: "The four deadlock conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Preemption breaks deadlocks." },
      {
  id: "os-q2",
  question: "Which scheduling algorithm may cause starvation?",
  options: ["FCFS", "Round Robin", "SJF", "FIFO"],
  correct: 2,
  explanation: "Shortest Job First (SJF) may cause starvation for longer processes."
},
{
  id: "os-q3",
  question: "Which memory management technique eliminates external fragmentation?",
  options: ["Segmentation", "Paging", "Swapping", "Compaction"],
  correct: 1,
  explanation: "Paging divides memory into fixed-size frames, eliminating external fragmentation."
},
{
  id: "os-q4",
  question: "What is a deadlock?",
  options: ["Process termination", "Infinite execution", "Processes waiting indefinitely for resources", "Memory overflow"],
  correct: 2,
  explanation: "Deadlock occurs when processes wait indefinitely for resources held by each other."
},
{
  id: "os-q5",
  question: "Which system call creates a new process in Unix?",
  options: ["create()", "fork()", "spawn()", "new()"],
  correct: 1,
  explanation: "fork() creates a new child process in Unix/Linux systems."
},
{
  id: "os-q6",
  question: "Which scheduling algorithm is preemptive?",
  options: ["FCFS", "SJF", "Round Robin", "FIFO"],
  correct: 2,
  explanation: "Round Robin is a preemptive scheduling algorithm."
},
{
  id: "os-q7",
  question: "What is the purpose of a semaphore?",
  options: ["Memory allocation", "Process synchronization", "File management", "CPU scheduling"],
  correct: 1,
  explanation: "Semaphores are used for process synchronization."
},
{
  id: "os-q8",
  question: "Which of the following is not a process state?",
  options: ["Ready", "Running", "Waiting", "Compiled"],
  correct: 3,
  explanation: "Compiled is not a process state."
},
{
  id: "os-q9",
  question: "Thrashing occurs when:",
  options: ["CPU utilization is high", "Excessive paging occurs", "Processes terminate", "Memory is free"],
  correct: 1,
  explanation: "Thrashing occurs when excessive paging reduces system performance."
},
{
  id: "os-q10",
  question: "Which page replacement algorithm replaces the oldest page?",
  options: ["LRU", "FIFO", "Optimal", "LFU"],
  correct: 1,
  explanation: "FIFO replaces the page that entered memory first."
}
    ]
  },
  cn: {
    title: "Computer Networks (CN)",
    notes: [
      { topic: "TCP vs UDP", details: "TCP is connection-oriented, reliable, orders packets (HTTP, SMTP). UDP is connectionless, fast, unreliable, doesn't guarantee order (Streaming, DNS)." },
      { topic: "OSI Layers", details: "Physical, Data Link, Network (IP), Transport (TCP/UDP), Session, Presentation, Application (HTTP)." }
    ],
    quizzes: [
      { id: "cn-q1", question: "At which layer of the OSI model does TCP protocol operate?", options: ["Network Layer", "Transport Layer", "Application Layer", "Data Link Layer"], correct: 1, explanation: "TCP (Transmission Control Protocol) and UDP operate at the Transport Layer of the OSI model." },
      {
  id: "cn-q2",
  question: "Which protocol is used to transfer web pages?",
  options: ["FTP", "HTTP", "SMTP", "DNS"],
  correct: 1,
  explanation: "HTTP is used for transferring web pages."
},
{
  id: "cn-q3",
  question: "Which device operates at the Network layer?",
  options: ["Hub", "Switch", "Router", "Repeater"],
  correct: 2,
  explanation: "Routers operate at the Network layer."
},
{
  id: "cn-q4",
  question: "What is the full form of DNS?",
  options: ["Domain Name System", "Data Network Service", "Digital Naming System", "Domain Network Service"],
  correct: 0,
  explanation: "DNS stands for Domain Name System."
},
{
  id: "cn-q5",
  question: "Which protocol is connectionless?",
  options: ["TCP", "UDP", "HTTP", "FTP"],
  correct: 1,
  explanation: "UDP is connectionless and does not guarantee delivery."
},
{
  id: "cn-q6",
  question: "Which layer is responsible for routing?",
  options: ["Transport", "Network", "Data Link", "Application"],
  correct: 1,
  explanation: "The Network layer handles routing."
},
{
  id: "cn-q7",
  question: "Which topology uses a central hub?",
  options: ["Bus", "Ring", "Star", "Mesh"],
  correct: 2,
  explanation: "Star topology uses a central hub or switch."
},
{
  id: "cn-q8",
  question: "What is the default port number of HTTP?",
  options: ["21", "25", "80", "443"],
  correct: 2,
  explanation: "HTTP uses port 80 by default."
},
{
  id: "cn-q9",
  question: "Which protocol is used for email transfer?",
  options: ["SMTP", "FTP", "HTTP", "DNS"],
  correct: 0,
  explanation: "SMTP is used for sending emails."
},
{
  id: "cn-q10",
  question: "Which OSI layer handles encryption?",
  options: ["Session", "Presentation", "Transport", "Application"],
  correct: 1,
  explanation: "The Presentation layer handles encryption and compression."
}
    ]
  },
  oops: {
    title: "Object-Oriented Programming (OOPS)",
    notes: [
      { topic: "Polymorphism", details: "Method Overloading (Compile-time: same method name, different signatures) and Method Overriding (Runtime: parent class method redefined in child)." },
      { topic: "Abstraction", details: "Hiding implementation details and exposing only interfaces (using abstract classes/interfaces)." }
    ],
    quizzes: [
      { id: "oop-q1", question: "What is Runtime Polymorphism achieved through?", options: ["Method Overloading", "Method Overriding", "Encapsulation", "Multiple Inheritance"], correct: 1, explanation: "Method Overriding allows a subclass to provide a specific implementation of a method already defined in its parent, supporting runtime polymorphism." },
      {
  id: "oop-q2",
  question: "Which OOP concept binds data and methods together?",
  options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"],
  correct: 1,
  explanation: "Encapsulation binds data and methods into a single unit."
},
{
  id: "oop-q3",
  question: "Which feature allows code reusability?",
  options: ["Inheritance", "Abstraction", "Polymorphism", "Encapsulation"],
  correct: 0,
  explanation: "Inheritance promotes code reusability."
},
{
  id: "oop-q4",
  question: "Which keyword is used to inherit a class in Java?",
  options: ["extends", "implements", "inherits", "super"],
  correct: 0,
  explanation: "The extends keyword is used for inheritance in Java."
},
{
  id: "oop-q5",
  question: "What is compile-time polymorphism achieved through?",
  options: ["Method Overloading", "Method Overriding", "Inheritance", "Abstraction"],
  correct: 0,
  explanation: "Method overloading supports compile-time polymorphism."
},
{
  id: "oop-q6",
  question: "Which OOP principle hides implementation details?",
  options: ["Encapsulation", "Abstraction", "Inheritance", "Polymorphism"],
  correct: 1,
  explanation: "Abstraction hides implementation details."
},
{
  id: "oop-q7",
  question: "Which access modifier provides maximum accessibility?",
  options: ["private", "protected", "public", "default"],
  correct: 2,
  explanation: "Public members can be accessed from anywhere."
},
{
  id: "oop-q8",
  question: "What is an object?",
  options: ["Blueprint", "Class instance", "Function", "Variable"],
  correct: 1,
  explanation: "An object is an instance of a class."
},
{
  id: "oop-q9",
  question: "Which keyword refers to the current object in Java?",
  options: ["super", "self", "this", "current"],
  correct: 2,
  explanation: "this refers to the current object."
},
{
  id: "oop-q10",
  question: "Which concept allows one interface with multiple implementations?",
  options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"],
  correct: 1,
  explanation: "Polymorphism allows multiple implementations through a common interface."
}
    ]
  }
};

export default function InterviewPrep({ apiBase, authHeaders, triggerToast }) {
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
        headers: { 
          'Content-Type': 'application/json',
          ...authHeaders
        },
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
