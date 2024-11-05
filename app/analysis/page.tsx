"use client"

// Analysis Component
import { useData } from "@/app/DataContext"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image" // Importing Image component
import type { App } from "@/app/DataContext" // Importing App type from DataContext

export default function Analysis() {
    const { data } = useData() // Access data from context
    const router = useRouter()

    if (!data) {
        return <p>No data available. Please try again.</p>
    }

    const DescriptionWithReadMore = ({ description }: { description: string }) => {
        const [isExpanded, setIsExpanded] = useState(false)
        const toggleExpand = () => setIsExpanded(!isExpanded)

        return (
            <div>
                <div
                    className="formatted-html-content text-sm mb-2"
                    dangerouslySetInnerHTML={{
                        __html: isExpanded ? description : `${description.slice(0, 200)}...`,
                    }}
                />
                <button onClick={toggleExpand} className="text-blue-500 hover:underline">
                    {isExpanded ? "Read Less" : "Read More"}
                </button>
            </div>
        )
    }

    const renderAppCard = (app: App, isReference: boolean) => (
        <Card key={app.app_id} className={`mb-4 ${isReference ? "border-primary" : ""}`}>
            <CardHeader>
                <div className="flex items-center space-x-4">
                    <Image
                        src={app.icon_url}
                        alt={`${app.title} icon`}
                        width={64}
                        height={64}
                        className="rounded-lg"
                    />
                    <div>
                        <CardTitle>{app.title}</CardTitle>
                        <CardDescription>{app.genre}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <DescriptionWithReadMore description={app.description} />
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Installs: {app.installs}</span>
                    <span>Rating: {app.ratings ? app.ratings.toFixed(1) : "N/A"}</span>
                </div>
                {app.insights && app.insights.length > 0 && (
                    <Accordion type="single" collapsible className="mt-4">
                        {app.insights.map((insight, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>{insight.title}</AccordionTrigger>
                                <AccordionContent>
                                    {insight.quotes.map((quote, qIndex) => (
                                        <p key={qIndex} className="text-sm mb-2">&#34;{quote}&#34;</p>
                                    ))}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {insight.sentiments.map((sentiment, sIndex) => (
                                            <Badge key={sIndex} variant="secondary">{sentiment}</Badge>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </CardContent>
        </Card>
    )

    return (
        <div className="container mx-auto p-4">
            <Button onClick={() => router.back()}>Back to Dashboard</Button>
            <div>
                <h2 className="text-2xl font-semibold mb-4">Reference App</h2>
                {renderAppCard(data.reference_app, true)}
                <h2 className="text-2xl font-semibold my-4">Competitors</h2>
                {data.competitors.map(app => renderAppCard(app, false))}
            </div>
        </div>
    )
}
