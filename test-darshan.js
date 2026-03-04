// Test this in your browser console or create a simple HTML file
// This will help isolate if the issue is authentication or data format

const testDarshanSlot = async () => {
    const testData = {
        templeId: 2,
        date: '2026-01-28',
        startTime: '10:00:00',
        endTime: '14:00:00',
        capacity: 40,
        price: 0
    };

    try {
        console.log('Testing darshan slot creation with data:', testData);
        
        const response = await fetch('http://localhost:8080/api/darshan/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        console.log('Response status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('Success! Created slot:', result);
        } else {
            const error = await response.text();
            console.error('Error response:', error);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
};

// Call the test function
testDarshanSlot();