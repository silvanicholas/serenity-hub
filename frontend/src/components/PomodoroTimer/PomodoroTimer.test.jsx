import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PomodoroTimer from './PomodoroTimer';

// Wrap component with Router since it uses useNavigate
const PomodoroWithRouter = () => {
    return (
        <BrowserRouter>
            <PomodoroTimer />
        </BrowserRouter>
    );
};

describe('PomodoroTimer', () => {
    beforeEach(() => {
        jest.useFakeTimers(); // Mock timers for testing
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    test('renders initial work session state', () => {
        render(<PomodoroWithRouter />);
        expect(screen.getByText('Work Session')).toBeInTheDocument();
        expect(screen.getByText('25:00')).toBeInTheDocument();
    });

    test('starts timer when start button is clicked', () => {
        render(<PomodoroWithRouter />);
        fireEvent.click(screen.getByText('Start'));
        
        act(() => {
            jest.advanceTimersByTime(1000); // Advance time by 1 second
        });
        
        expect(screen.getByText('24:59')).toBeInTheDocument();
    });

    test('pauses timer when pause button is clicked', () => {
        render(<PomodoroWithRouter />);
        
        // Start the timer
        fireEvent.click(screen.getByText('Start'));
        
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        
        // Pause the timer
        fireEvent.click(screen.getByText('Pause'));
        
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        
        // Time should not change after pause
        expect(screen.getByText('24:59')).toBeInTheDocument();
    });

    test('resets timer when reset button is clicked', () => {
        render(<PomodoroWithRouter />);
        
        // Start and advance timer
        fireEvent.click(screen.getByText('Start'));
        
        act(() => {
            jest.advanceTimersByTime(5000); // Advance 5 seconds
        });
        
        // Reset timer
        fireEvent.click(screen.getByText('Reset'));
        
        expect(screen.getByText('25:00')).toBeInTheDocument();
        expect(screen.getByText('Work Session')).toBeInTheDocument();
    });

    test('switches to break session after work session completes', () => {
        render(<PomodoroWithRouter />);
        
        fireEvent.click(screen.getByText('Start'));
        
        act(() => {
            jest.advanceTimersByTime(25 * 60 * 1000); // Advance full work session
        });
        
        expect(screen.getByText('Break Session')).toBeInTheDocument();
        expect(screen.getByText('05:00')).toBeInTheDocument();
    });
});