import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CaseProvider } from './context/CaseContext';
import { CaseDataProvider } from './context/CaseDataContext';
import { ActiveCaseProvider, useActiveCase } from './context/ActiveCase';
import App from './App';
import './styles/main.css';

// The active case id drives both the saved progress and the data loaded from the API.
function Providers() {
  const { caseId } = useActiveCase();
  return <CaseDataProvider caseId={caseId}><CaseProvider caseId={caseId}><App /></CaseProvider></CaseDataProvider>;
}

createRoot(document.getElementById('root')).render(
  <StrictMode><BrowserRouter><ActiveCaseProvider><Providers /></ActiveCaseProvider></BrowserRouter></StrictMode>
);
