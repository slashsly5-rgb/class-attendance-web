'use client'

import { useState, useMemo } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { getHealthColor } from '@/lib/utils/attendance-thresholds'

interface StudentRosterProps {
    students: Array<{
        id: string
        full_name: string
        student_id: string
        totalSessions: number
        attended: number
        absent: number
        late: number
        percentage: number
        healthStatus: 'excellent' | 'warning' | 'critical'
    }>
    className?: string
}

export function StudentRoster({ students, className }: StudentRosterProps) {
    const [sortBy, setSortBy] = useState<'name' | 'percentage' | 'absent'>('percentage')
    const [filterAtRisk, setFilterAtRisk] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState('')

    const processedStudents = useMemo(() => {
        let filtered = students

        // Apply at-risk filter (2 or more absences)
        if (filterAtRisk) {
            filtered = filtered.filter(s => s.absent >= 2)
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase().trim()
            filtered = filtered.filter(s =>
                s.full_name.toLowerCase().includes(query) ||
                s.student_id.toLowerCase().includes(query)
            )
        }

        // Apply sort
        return [...filtered].sort((a, b) => {
            if (sortBy === 'name') {
                return a.full_name.localeCompare(b.full_name)
            }
            if (sortBy === 'percentage') {
                // High to low
                return b.percentage - a.percentage
            }
            if (sortBy === 'absent') {
                // High to low
                if (b.absent === a.absent) {
                    return a.full_name.localeCompare(b.full_name)
                }
                return b.absent - a.absent
            }
            return 0
        })
    }, [students, sortBy, filterAtRisk, searchQuery])

    return (
        <div className={cn("space-y-6", className)}>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex-1 w-full max-w-sm">
                    <Input
                        placeholder="Search by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center space-x-2 bg-slate-50 border rounded-md px-3 py-2">
                        <Switch
                            id="at-risk-mode"
                            checked={filterAtRisk}
                            onCheckedChange={setFilterAtRisk}
                        />
                        <Label htmlFor="at-risk-mode" className="cursor-pointer text-sm font-medium">
                            At Risk Only (2+ Absences)
                        </Label>
                    </div>

                    <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="percentage">Sort by Attendance %</SelectItem>
                            <SelectItem value="absent">Sort by Absences</SelectItem>
                            <SelectItem value="name">Sort by Name</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border bg-white overflow-hidden overflow-x-auto">
                <Table className="min-w-[800px]">
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-[250px]">Student Name</TableHead>
                            <TableHead>Student ID</TableHead>
                            <TableHead className="text-right">Sessions</TableHead>
                            <TableHead className="text-right">Attended</TableHead>
                            <TableHead className="text-right">Late</TableHead>
                            <TableHead className="text-right">Absent</TableHead>
                            <TableHead className="text-right">Attendance %</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {processedStudents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                    {students.length === 0
                                        ? "No students are enrolled in this class."
                                        : "No students match your filters."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            processedStudents.map((student) => {
                                const isAtRisk = student.absent >= 2
                                const healthColor = getHealthColor(student.healthStatus)

                                return (
                                    <TableRow
                                        key={student.id}
                                        className={cn(isAtRisk && "border-l-4 border-l-red-500 bg-red-50/30")}
                                    >
                                        <TableCell className="font-medium whitespace-nowrap">
                                            {student.full_name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground font-mono text-sm">
                                            {student.student_id}
                                        </TableCell>
                                        <TableCell className="text-right">{student.totalSessions}</TableCell>
                                        <TableCell className="text-right text-green-700">{student.attended}</TableCell>
                                        <TableCell className="text-right text-amber-600">{student.late}</TableCell>
                                        <TableCell className={cn("text-right", isAtRisk && "text-red-600 font-bold")}>
                                            {student.absent}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge
                                                variant="outline"
                                                className={cn("font-medium", healthColor.text, healthColor.border, healthColor.bg)}
                                            >
                                                {student.percentage.toFixed(1)}%
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
