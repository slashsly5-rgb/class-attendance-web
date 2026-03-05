import { getHealthStatus, getHealthColor } from './attendance-thresholds';

describe('Attendance Thresholds Utilities', () => {
    describe('getHealthStatus', () => {
        it('returns critical when attendance is exactly 0', () => {
            expect(getHealthStatus(0)).toBe('critical');
        });

        it('returns critical when attendance is below 70%', () => {
            expect(getHealthStatus(69.9)).toBe('critical');
            expect(getHealthStatus(50)).toBe('critical');
        });

        it('returns warning when attendance is exactly 70%', () => {
            expect(getHealthStatus(70.0)).toBe('warning');
        });

        it('returns warning when attendance is between 70% and 85%', () => {
            expect(getHealthStatus(75)).toBe('warning');
            expect(getHealthStatus(84.9)).toBe('warning');
        });

        it('returns excellent when attendance is exactly 85%', () => {
            expect(getHealthStatus(85.0)).toBe('excellent');
        });

        it('returns excellent when attendance is above 85%', () => {
            expect(getHealthStatus(95)).toBe('excellent');
            expect(getHealthStatus(100)).toBe('excellent');
        });

        it('returns critical for invalid inputs', () => {
            expect(getHealthStatus(null)).toBe('critical');
            expect(getHealthStatus(undefined)).toBe('critical');
            expect(getHealthStatus(NaN)).toBe('critical');
        })
    });

    describe('getHealthColor', () => {
        it('returns green styling for excellent status', () => {
            const color = getHealthColor('excellent');
            expect(color.text).toContain('green');
            expect(color.bg).toContain('green');
        });

        it('returns yellow styling for warning status', () => {
            const color = getHealthColor('warning');
            expect(color.text).toContain('yellow');
            expect(color.bg).toContain('yellow');
        });

        it('returns red styling for critical status', () => {
            const color = getHealthColor('critical');
            expect(color.text).toContain('red');
            expect(color.bg).toContain('red');
        });
    });
});
