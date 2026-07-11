import React from 'react';
import { greetUser } from '@ai-mentor/core';

export function MobileApp() {
  const mockUser = {
    id: 'u2',
    name: 'Hariom Mobile',
    email: 'hariom.m@mentor.ai',
    role: 'student' as const,
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 24, margin: '0 0 10px 0' }}>AI Mentor Mobile</h1>
      <p style={{ color: '#555' }}>{greetUser(mockUser)}</p>
      <div
        style={{
          marginTop: 20,
          padding: 15,
          borderRadius: 8,
          backgroundColor: '#f0f4f8',
        }}
      >
        <h3 style={{ margin: '0 0 5px 0' }}>Micro-Lesson</h3>
        <p style={{ fontSize: 14, color: '#333' }}>
          Complete your 5-minute interactive AI trivia for the day!
        </p>
        <button
          style={{
            backgroundColor: '#0066cc',
            color: '#fff',
            border: 'none',
            padding: '10px 15px',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Start Now
        </button>
      </div>
    </div>
  );
}
