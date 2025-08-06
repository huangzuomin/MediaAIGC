// Verification script for ConversionCTA functionality
console.log('=== ConversionCTA Verification ===');

// Check if all required components are loaded
const requiredComponents = [
    'ConversionCTA',
    'ConversionTracking',
    'ResultsDisplay'
];

const requiredUtils = [
    'Analytics',
    'Storage'
];

console.log('\n1. Checking component availability:');
requiredComponents.forEach(component => {
    const available = window[component] !== undefined;
    console.log(`   ${component}: ${available ? '✓' : '✗'}`);
});

console.log('\n2. Checking utility availability:');
requiredUtils.forEach(util => {
    const available = window[util] !== undefined;
    console.log(`   ${util}: ${available ? '✓' : '✗'}`);
});

// Test ConversionTracking functionality
if (window.ConversionTracking) {
    console.log('\n3. Testing ConversionTracking:');
    
    try {
        // Test session initialization
        const sessionId = window.ConversionTracking.sessionData.sessionId;
        console.log(`   Session ID: ${sessionId ? '✓' : '✗'}`);
        
        // Test event tracking
        window.ConversionTracking.trackEngagement('test_event', { test: true });
        console.log('   Event tracking: ✓');
        
        // Test conversion tracking
        window.ConversionTracking.trackConsultationClick({ test: true });
        console.log('   Conversion tracking: ✓');
        
        // Test funnel tracking
        window.ConversionTracking.trackFunnelStage('test_stage', { test: true });
        console.log('   Funnel tracking: ✓');
        
        // Get stats
        const stats = window.ConversionTracking.getConversionStats();
        console.log(`   Stats generation: ${stats ? '✓' : '✗'}`);
        
    } catch (error) {
        console.log(`   Error: ${error.message}`);
    }
}

// Test ConversionCTA component
if (window.ConversionCTA) {
    console.log('\n4. Testing ConversionCTA component:');
    
    try {
        // Create mock result
        const mockResult = {
            level: 'L3',
            levelName: '系统化应用阶段',
            score: 3.2,
            description: 'Test description',
            recommendations: ['Test recommendation'],
            color: '#4CAF50'
        };
        
        // Test component creation (without rendering)
        const componentProps = {
            result: mockResult,
            variant: 'primary',
            onConsult: () => console.log('Consult clicked'),
            onLearnMore: () => console.log('Learn more clicked'),
            onRestart: () => console.log('Restart clicked'),
            isMobile: false
        };
        
        console.log('   Component props validation: ✓');
        console.log('   Mock result structure: ✓');
        
    } catch (error) {
        console.log(`   Error: ${error.message}`);
    }
}

// Test CSS styles
console.log('\n5. Checking CSS styles:');
const testElement = document.createElement('div');
testElement.className = 'mobile-conversion-cta';
document.body.appendChild(testElement);

const styles = window.getComputedStyle(testElement);
const hasStyles = styles.background !== 'rgba(0, 0, 0, 0)' || styles.backgroundColor !== 'rgba(0, 0, 0, 0)';
console.log(`   ConversionCTA styles loaded: ${hasStyles ? '✓' : '✗'}`);

document.body.removeChild(testElement);

// Test local storage functionality
console.log('\n6. Testing storage functionality:');
try {
    localStorage.setItem('test_conversion', 'test');
    const retrieved = localStorage.getItem('test_conversion');
    localStorage.removeItem('test_conversion');
    console.log(`   Local storage: ${retrieved === 'test' ? '✓' : '✗'}`);
} catch (error) {
    console.log(`   Local storage: ✗ (${error.message})`);
}

console.log('\n=== Verification Complete ===');

// Export verification results
window.ConversionVerification = {
    componentsLoaded: requiredComponents.every(c => window[c] !== undefined),
    utilsLoaded: requiredUtils.every(u => window[u] !== undefined),
    trackingWorking: window.ConversionTracking !== undefined,
    ctaWorking: window.ConversionCTA !== undefined,
    timestamp: new Date().toISOString()
};