import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function LecturerDashboardLoading() {
    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="h-8 w-64 bg-slate-200 rounded-md mb-2"></div>
                    <div className="h-4 w-48 bg-slate-200 rounded-md"></div>
                </div>
                <div className="h-10 w-32 bg-slate-200 rounded-md"></div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Analytics Card Skeletons */}
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="flex flex-col h-full border-l-4">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-2 w-full">
                                    <div className="h-6 w-3/4 bg-slate-200 rounded-md"></div>
                                    <div className="h-4 w-1/2 bg-slate-200 rounded-md"></div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="h-3 w-3/4 bg-slate-200 rounded-md"></div>
                                        <div className="h-6 w-1/2 bg-slate-200 rounded-md"></div>
                                    </div>
                                    <div className="space-y-2 text-right">
                                        <div className="h-3 w-3/4 bg-slate-200 rounded-md ml-auto"></div>
                                        <div className="h-6 w-1/2 bg-slate-200 rounded-md ml-auto"></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
