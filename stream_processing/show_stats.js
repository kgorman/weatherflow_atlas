// Show WeatherFlow processor statistics
print("📊 WeatherFlow Processor Statistics");
print("===================================");

try {
    // Get processor stats
    const stats = sp.weatherflow_unified.stats();
    
    print("\n🔍 Processor Status:");
    print(`   State: ${stats.state}`);
    print(`   Created: ${stats.created}`);
    if (stats.started) {
        print(`   Started: ${stats.started}`);
    }
    
    print("\n📈 Processing Stats:");
    if (stats.stats) {
        print(`   Documents Processed: ${stats.stats.documentsProcessed || 0}`);
        print(`   Documents Output: ${stats.stats.documentsOutput || 0}`);
        print(`   Bytes Processed: ${stats.stats.bytesProcessed || 0}`);
        print(`   Processing Time: ${stats.stats.processingTimeMs || 0}ms`);
        
        if (stats.stats.stages) {
            print("\n🔧 Stage Performance:");
            stats.stats.stages.forEach((stage, index) => {
                print(`   Stage ${index + 1}: ${stage.operator || 'unknown'}`);
                if (stage.documentsProcessed !== undefined) {
                    print(`     Documents: ${stage.documentsProcessed}`);
                }
                if (stage.processingTimeMs !== undefined) {
                    print(`     Time: ${stage.processingTimeMs}ms`);
                }
            });
        }
    }
    
    print("\n🌐 HTTP Stats:");
    if (stats.stats && stats.stats.https) {
        const httpStats = stats.stats.https;
        print(`   Total Requests: ${httpStats.totalRequests || 0}`);
        print(`   Successful Requests: ${httpStats.successfulRequests || 0}`);
        print(`   Failed Requests: ${httpStats.failedRequests || 0}`);
        print(`   Average Response Time: ${httpStats.avgResponseTimeMs || 0}ms`);
    }
    
    print("\n⚡ Recent Activity:");
    if (stats.lastProcessed) {
        print(`   Last Processed: ${stats.lastProcessed}`);
    }
    
    print("\n📋 Full Stats Object:");
    print(JSON.stringify(stats, null, 2));

} catch (error) {
    print("❌ Error getting stats:", error.message);
    
    // Try alternative methods
    try {
        print("\n🔍 Trying sp.listStreamProcessors()...");
        const processors = sp.listStreamProcessors();
        const weatherflow = processors.find(p => p.name === 'weatherflow_unified');
        if (weatherflow) {
            print("Found weatherflow_unified processor:");
            print(JSON.stringify(weatherflow, null, 2));
        } else {
            print("weatherflow_unified processor not found in list");
        }
    } catch (listError) {
        print("❌ Error listing processors:", listError.message);
    }
}
