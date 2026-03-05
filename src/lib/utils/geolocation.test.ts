import { calculateDistance } from './geolocation';

describe('Geolocation Utilities', () => {
    describe('calculateDistance (Haversine Formula)', () => {
        it('returns 0 when coordinates are identical', () => {
            const dist = calculateDistance(3.1415, 101.6865, 3.1415, 101.6865);
            expect(dist).toBe(0);
        });

        it('calculates the correct distance between KLCC and KL Tower (approx 1000m)', () => {
            // KLCC
            const lat1 = 3.1578;
            const lon1 = 101.7118;
            // KL Tower
            const lat2 = 3.1528;
            const lon2 = 101.7037;

            const dist = calculateDistance(lat1, lon1, lat2, lon2);

            // Real distance is ~1040 meters. Allow +/- 50 meters variance due to Earth's shape approximations
            expect(dist).toBeGreaterThan(990);
            expect(dist).toBeLessThan(1090);
        });

        it('handles negative coordinates correctly', () => {
            // Points in different hemispheres
            const dist = calculateDistance(10, -10, -10, 10);

            // Known distance is approx 3110km -> 3110000m
            expect(dist / 1000).toBeCloseTo(3140, -1); // Within tens of km approximation
        });
    });

    // Removed isWithinRadius tests as the method was removed from geolocation.ts
});
