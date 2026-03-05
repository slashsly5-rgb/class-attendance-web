import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function StudentDashboardLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="h-8 w-64 bg-slate-200 rounded-md mb-2"></div>
                    <div className="h-4 w-48 bg-slate-200 rounded-md"></div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Class Card Skeletons */}
                {[1, 2].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="space-y-2 w-full">
                                    <div className="h-6 w-3/4 bg-slate-200 rounded-md"></div>
                                    <div className="h-4 w-1/2 bg-slate-200 rounded-md"></div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 pt-4 border-t">
                                <div className="flex justify-between">
                                    <div className="h-4 w-1/3 bg-slate-200 rounded-md"></div>
                                    <div className="h-4 w-1/4 bg-slate-200 rounded-md"></div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="h-4 w-1/3 bg-slate-200 rounded-md"></div>
                                    <div className="h-4 w-1/4 bg-slate-200 rounded-md"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
