import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import EventsDashboard from '@/components/pages/EventsDashboard'
import EventDetail from '@/components/pages/EventDetail'
import ContactLists from '@/components/pages/ContactLists'
import Messages from '@/components/pages/Messages'
import Reports from '@/components/pages/Reports'
import Settings from '@/components/pages/Settings'

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<EventsDashboard />} />
            <Route path="/events" element={<EventsDashboard />} />
            <Route path="/events/:eventId" element={<EventDetail />} />
            <Route path="/contact-lists" element={<ContactLists />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  )
}

export default App