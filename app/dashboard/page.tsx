"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import {onAuthStateChanged, User} from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import AuthPage from "@/app/auth-page/page"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useData, AppInsightsData } from "@/app/DataContext" // Import types

type AnalysisPreview = {
    appId: string;
    timestamp: string;
}

export default function Dashboard() {
    const [appId, setAppId] = useState("")
    const [country, setCountry] = useState("")
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true)
    const [previousAnalyses, setPreviousAnalyses] = useState<AnalysisPreview[]>([])
    const { setData } = useData() // Access setData from context
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user)
            setLoading(false)

            if (user) {
                await fetchPreviousAnalyses(user.uid)
            }
        })

        return () => unsubscribe()
    }, [])

    // Fetch previous analyses from Firestore for the logged-in user
    const fetchPreviousAnalyses = async (userId: string) => {
        setLoading(true);
        try {
            const analyses: AnalysisPreview[] = [];

            // Step 1: Reference to the user's analyses collection
            const analysesCollectionRef = collection(db, "users", userId, "analyses");
            const appSnapshots = await getDocs(analysesCollectionRef);

            // Step 2: Loop through each app document (e.g., "com.duolingo", "com.instagram.android")
            appSnapshots.forEach((appDoc) => {
                const appId = appDoc.id; // Document ID representing the appId
                const data = appDoc.data();
                const timestamp = data.timestamp; // Extract timestamp field from the document

                // Push the appId and timestamp to the analyses array
                analyses.push({
                    appId: appId,
                    timestamp: timestamp,
                });
            });

            setPreviousAnalyses(analyses);
        } catch (error) {
            console.error("Error fetching previous analyses:", error);
        }
        setLoading(false);
    };

    // Handle preview click, fetch data, and set in DataContext
    const handlePreviewClick = async (appId: string) => {
        if (!user) return
        setLoading(true)
        try {
            const analysisDocRef = doc(db, "users", user.uid, "analyses", appId)
            const analysisSnapshot = await getDoc(analysisDocRef)

            if (analysisSnapshot.exists()) {
                const data = analysisSnapshot.data() as AppInsightsData
                setData(data) // Store data in DataContext
                router.push("/analysis") // Navigate to the analysis page
            } else {
                console.error("Analysis data not found")
            }
        } catch (error) {
            console.error("Error fetching analysis data:", error)
        }
        setLoading(false)
    }

    // Fetch new analysis data and redirect to analysis page
    const fetchData = async () => {
        setLoading(true);
        console.log("Fetching data with appId:", appId, "and country:", country);
        try {
            if (user) {
                const userId = user.uid;
                const response = await fetch(
                    `https://app-insights-535693938808.europe-west3.run.app/?appId=${appId}&region=${country}&num_results=10&userId=${userId}`
                );
                const jsonData = await response.json();
                setData(jsonData); // Save data to context
                router.push("/analysis"); // Navigate to analysis page
            } else {
                console.error("User not authenticated");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
        console.log("Finished loading:", loading);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!user) {
        return <AuthPage />
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">AppInsights</h1>
                <Button onClick={() => auth.signOut()}>Sign Out</Button>
            </div>

            {/* Input for new analysis */}
            <div className="flex space-x-4 mb-6">
                <Input
                    placeholder="Enter App ID (e.g., com.instagram.android)"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                />
                <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="gb">United Kingdom</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={fetchData} disabled={loading}>
                    {loading ?
                        <div className="text-center text-gray-500 mb-6">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            <p>This process might take 1-3 minutes. Please wait...</p>
                        </div> : "Analyze"}
                </Button>
            </div>

            {/* Loading message */}
            {loading && (
                <div className="text-center text-gray-500 mb-6">
                    <p>This process might take 1-3 minutes. Please wait...</p>
                </div>
            )}

            {/* List of previous analyses */}
            <div>
                <h2 className="text-2xl font-semibold mb-4">Previous Analyses</h2>
                {previousAnalyses.map(({ appId, timestamp }) => {
                    const [parsedAppId] = appId.split(";"); // Split by ";" and take the first part

                    return (
                        <Card
                            key={`${appId}-${timestamp}`}
                            onClick={() => handlePreviewClick(appId)}
                            className="mb-4 cursor-pointer"
                        >
                            <CardHeader>
                                <CardTitle>{parsedAppId}</CardTitle>
                                <CardDescription>Timestamp: {timestamp}</CardDescription>
                            </CardHeader>
                        </Card>
                    );
                })}
            </div>

        </div>
    )

}
