
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function AuthPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            router.push("/dashboard")
        } catch (error) {
            setError((error as Error).message)
        }
        setLoading(false)
    }

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await signInWithEmailAndPassword(auth, email, password)
            router.push("/dashboard")
        } catch (error) {
            setError((error as Error).message)
        }
        setLoading(false)
    }

    const handleGoogleSignIn = async () => {
        setLoading(true)
        setError(null)
        const provider = new GoogleAuthProvider()
        try {
            await signInWithPopup(auth, provider)
            router.push("/dashboard")
        } catch (error) {
            setError((error as Error).message)
        }
        setLoading(false)
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Welcome to AppInsights</CardTitle>
                    <CardDescription>Login or create an account to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <form onSubmit={handleEmailSignIn}>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    </div>
                                </div>
                                <Button className="w-full mt-4" type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
                                </Button>
                            </form>
                        </TabsContent>
                        <TabsContent value="signup">
                            <form onSubmit={handleEmailSignUp}>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    </div>
                                </div>
                                <Button className="w-full mt-4" type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign in with Google"}
                    </Button>
                    {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}