import ChatWindow from './components/ChatWindow';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-slate-800">Dify Chat Client</h1>
        </header>
        <ChatWindow />
      </div>
    </div>
  );
}

export default App;
