import { Routes, Route } from 'react-router-dom';
import { InterviewProvider } from '@/context/InterviewContext';
import { HomePage, InterviewPage, DashboardPage, SessionSummaryPage } from '@/pages';

function App() {
  return (
    <InterviewProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/interview/:sessionId" element={<InterviewPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/summary" element={<SessionSummaryPage />} />
      </Routes>
    </InterviewProvider>
  );
}

export default App;
