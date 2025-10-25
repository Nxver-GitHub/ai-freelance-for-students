"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
import type { StartupProfile } from "@/lib/types"

interface StartupProfileFormProps {
  userId: string
  initialData: StartupProfile | null
}

export default function StartupProfileForm({ userId, initialData }: StartupProfileFormProps) {
  const [companyName, setCompanyName] = useState(initialData?.company_name || "")
  const [companyWebsite, setCompanyWebsite] = useState(initialData?.company_website || "")
  const [companySize, setCompanySize] = useState<string>(initialData?.company_size || "")
  const [industry, setIndustry] = useState(initialData?.industry || "")
  const [ycBatch, setYcBatch] = useState(initialData?.yc_batch || "")
  const [isYcBacked, setIsYcBacked] = useState(initialData?.is_yc_backed || false)
  const [description, setDescription] = useState(initialData?.description || "")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error: updateError } = await supabase
        .from("startup_profiles")
        .update({
          company_name: companyName,
          company_website: companyWebsite || null,
          company_size: companySize || null,
          industry: industry || null,
          yc_batch: ycBatch || null,
          is_yc_backed: isYcBacked,
          description: description || null,
        })
        .eq("id", userId)

      if (updateError) throw updateError

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name *</Label>
        <Input
          id="companyName"
          placeholder="e.g., Acme Inc."
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyWebsite">Company Website</Label>
        <Input
          id="companyWebsite"
          type="url"
          placeholder="https://yourcompany.com"
          value={companyWebsite}
          onChange={(e) => setCompanyWebsite(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Company Description</Label>
        <Textarea
          id="description"
          placeholder="Tell us about your company, mission, and what you're building..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companySize">Company Size</Label>
          <Select value={companySize} onValueChange={setCompanySize}>
            <SelectTrigger>
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10 employees</SelectItem>
              <SelectItem value="11-50">11-50 employees</SelectItem>
              <SelectItem value="51-200">51-200 employees</SelectItem>
              <SelectItem value="200+">200+ employees</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            placeholder="e.g., SaaS, FinTech, HealthTech"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="isYcBacked" checked={isYcBacked} onCheckedChange={(checked) => setIsYcBacked(!!checked)} />
          <Label htmlFor="isYcBacked" className="font-normal cursor-pointer">
            Y Combinator backed
          </Label>
        </div>

        {isYcBacked && (
          <div className="space-y-2">
            <Label htmlFor="ycBatch">YC Batch</Label>
            <Input
              id="ycBatch"
              placeholder="e.g., W23, S24"
              value={ycBatch}
              onChange={(e) => setYcBatch(e.target.value)}
            />
          </div>
        )}
      </div>

      {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  )
}
