import { useState, useRef } from 'react';
import { Check, Upload, Laptop, CreditCard, ClipboardList, FileText } from 'lucide-react';

export default function ExitChecklist({ checklist, onToggleTask, onUploadKTDoc }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const duration = 1000; // 1s upload
    const intervalTime = 40;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsUploading(false);
          onUploadKTDoc(file.name);
          return 100;
        }
        return Math.min(prev + step, 100);
      });
    }, intervalTime);
  };

  const triggerUpload = () => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Icon mapping helper
  const getTaskIcon = (taskId) => {
    switch (taskId) {
      case 'handover':
        return <ClipboardList size={16} />;
      case 'laptop':
        return <Laptop size={16} />;
      case 'access_card':
        return <CreditCard size={16} />;
      case 'kt_upload':
      default:
        return <FileText size={16} />;
    }
  };

  return (
    <div 
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>
          Exit Checklist
        </h3>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
          Complete these required clearing tasks before your Last Working Day.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {checklist.map((task) => {
          const isDone = task.completed;
          const isKT = task.id === 'kt_upload';

          return (
            <div 
              key={task.id}
              style={{
                height: '52px', // Spacing & Layout Token: Checklist item 52px height
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                backgroundColor: isDone ? 'rgba(16, 185, 129, 0.02)' : 'var(--bg-primary)',
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                borderColor: isDone ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-color)'
              }}
            >
              {/* Left Column: Icon + Task Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div 
                  style={{ 
                    color: isDone ? 'hsl(150, 70%, 50%)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isDone ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-tertiary)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px'
                  }}
                >
                  {getTaskIcon(task.id)}
                </div>
                
                <span 
                  style={{ 
                    fontSize: '13px', // Typography Token: Checklist task 13px / 500
                    fontWeight: '500',
                    color: isDone ? 'hsl(150, 70%, 50%)' : 'var(--text-primary)', // --checklist-done HSL
                    textDecoration: isDone ? 'line-through' : 'none',
                    opacity: isDone ? 0.8 : 1
                  }}
                >
                  {task.label}
                  {isKT && task.fileName && (
                    <span style={{ fontSize: '11px', display: 'block', color: 'var(--text-muted)', textDecoration: 'none' }}>
                      File: {task.fileName}
                    </span>
                  )}
                </span>
              </div>

              {/* Right Column: Toggle Actions or Loading progress */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {isKT ? (
                  isUploading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', width: '120px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '9px', fontWeight: '700', color: 'var(--accent-green)' }}>
                        <span>UPLOADING</span>
                        <span>{Math.round(uploadProgress)}%</span>
                      </div>
                      <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', backgroundColor: 'var(--accent-green)', width: `${uploadProgress}%`, transition: 'width 0.05s linear' }} />
                      </div>
                    </div>
                  ) : isDone ? (
                    <button
                      type="button"
                      onClick={() => onToggleTask(task.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: '11px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        textDecoration: 'underline'
                      }}
                    >
                      Delete
                    </button>
                  ) : (
                    <>
                      <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*,application/pdf,.docx,.doc,.txt"
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={triggerUpload}
                        style={{
                          backgroundColor: 'var(--text-primary)',
                          color: 'var(--bg-secondary)',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Upload size={12} />
                        <span>Upload KT</span>
                      </button>
                    </>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => onToggleTask(task.id)}
                    style={{
                      backgroundColor: isDone ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                      color: isDone ? 'hsl(150, 70%, 50%)' : 'var(--text-secondary)',
                      border: isDone ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--border-color)',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      if (!isDone) {
                        e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isDone) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {isDone ? (
                      <>
                        <Check size={12} strokeWidth={3} />
                        <span>Completed</span>
                      </>
                    ) : (
                      <span>Mark Complete</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
