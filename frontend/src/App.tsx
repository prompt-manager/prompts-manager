import React from 'react'
import Home from './pages/home/Home'
import PromptMain from './pages/prompt/PromptMain'
import EvaluationMain from './pages/evaluation/EvaluationMain'
import DatasetsMain from './pages/datasets/DatasetsMain'
import NotFound from './pages/error/NotFound'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/base.scss'
import CreatePrompt from './pages/prompt/CreatePrompt'
import EditPromptPage from './pages/prompt/ManagePrompt'
import { GlobalStyle } from './components/data-entry/select/Select.style'

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prompt" element={<PromptMain />} />
          <Route path="/prompt/create" element={<CreatePrompt />} />
          <Route path="/prompt/manage" element={<EditPromptPage />} />
          <Route path="/evaluation" element={<EvaluationMain />} />
          <Route path="/datasets" element={<DatasetsMain />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
