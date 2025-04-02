"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Save, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  // General
  name: z.string().min(2, {
    message: "Group name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  groupType: z.enum(["project", "department", "interest", "other"]),

  // Access Control
  accessLevel: z.enum(["open", "restricted", "closed"]),
  allowedRoles: z.array(z.string()),
  allowedDepartments: z.array(z.string()),
  externalCollaboration: z.boolean().default(false),
  dataClassification: z.enum(["public", "internal", "confidential", "restricted"]),
  ipRestriction: z.boolean().default(false),
  allowedIpRanges: z.string().optional(),

  // Squad Management
  enableSquads: z.boolean().default(false),
  maxSquadsPerGroup: z.string().optional(),
  squadCreationPermission: z.enum(["all_members", "moderators", "admins"]),
  autoAssignSquads: z.boolean().default(false),
  squadNamingConvention: z.string().optional(),

  // Permissions
  defaultMemberRole: z.string(),
  customRoles: z
    .array(
      z.object({
        name: z.string(),
        permissions: z.array(z.string()),
      }),
    )
    .optional(),
  allowMemberInvites: z.boolean().default(false),
  allowContentCreation: z.boolean().default(true),
  moderationLevel: z.enum(["low", "medium", "high"]),
  contentApprovalRequired: z.boolean().default(false),
  twoFactorAuthRequired: z.boolean().default(false),

  // Activity
  allowDiscussions: z.boolean().default(true),
  allowEvents: z.boolean().default(true),
  allowFileSharing: z.boolean().default(true),
  allowPolls: z.boolean().default(true),
  allowTaskAssignment: z.boolean().default(false),
  activityFeed: z.boolean().default(true),

  // Content Management
  contentRetentionPeriod: z.string().optional(),
  autoArchiveInactiveContent: z.boolean().default(false),
  enableVersioning: z.boolean().default(false),
  enableTags: z.boolean().default(true),
  mandatoryTags: z.array(z.string()).optional(),

  // Notifications
  notifyNewMembers: z.boolean().default(true),
  notifyNewContent: z.boolean().default(true),
  digestFrequency: z.enum(["never", "daily", "weekly"]),
  allowCustomNotifications: z.boolean().default(false),
  notificationChannels: z.array(z.string()),

  // Integration
  enableSlackIntegration: z.boolean().default(false),
  slackWorkspace: z.string().optional(),
  enableMsTeamsIntegration: z.boolean().default(false),
  msTeamsTeam: z.string().optional(),
})

export default function GroupSettingsForm() {
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "My Awesome Group",
      description: "A group for awesome people doing awesome things",
      isActive: true,
      groupType: "project",
      accessLevel: "restricted",
      allowedRoles: [],
      allowedDepartments: [],
      externalCollaboration: false,
      dataClassification: "internal",
      ipRestriction: false,
      enableSquads: false,
      maxSquadsPerGroup: "5",
      squadCreationPermission: "moderators",
      autoAssignSquads: false,
      defaultMemberRole: "member",
      allowMemberInvites: false,
      allowContentCreation: true,
      moderationLevel: "medium",
      contentApprovalRequired: false,
      twoFactorAuthRequired: false,
      allowDiscussions: true,
      allowEvents: true,
      allowFileSharing: true,
      allowPolls: true,
      allowTaskAssignment: false,
      activityFeed: true,
      autoArchiveInactiveContent: false,
      enableVersioning: false,
      enableTags: true,
      notifyNewMembers: true,
      notifyNewContent: true,
      digestFrequency: "weekly",
      allowCustomNotifications: false,
      notificationChannels: ["email"],
      enableSlackIntegration: false,
      enableMsTeamsIntegration: false,
    },
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle file upload for group avatar
    console.log(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
    multiple: false,
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      console.log(values)
      setIsSaving(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Group Settings</h1>
        <p className="text-muted-foreground">Manage settings for this group. Changes will be applied immediately.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="squads">Squads</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>Basic information about the group</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter group name" {...field} />
                        </FormControl>
                        <FormDescription>This is the name that will be displayed for your group.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a description for this group"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <FormLabel>Group Avatar</FormLabel>
                    <div
                      {...getRootProps()}
                      className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-6 transition-colors hover:bg-muted"
                    >
                      <input {...getInputProps()} />
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        {isDragActive ? "Drop the avatar here" : "Drag & drop an avatar, or click to select"}
                      </p>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="groupType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select group type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="project">Project</SelectItem>
                            <SelectItem value="department">Department</SelectItem>
                            <SelectItem value="interest">Interest</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The type of group determines some default settings and features.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active Status</FormLabel>
                          <FormDescription>Disable to temporarily suspend this group.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="access">
              <Card>
                <CardHeader>
                  <CardTitle>Access Control</CardTitle>
                  <CardDescription>Manage who can access and interact with the group</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="accessLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Access Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select access level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="open">Open (Anyone can join)</SelectItem>
                            <SelectItem value="restricted">Restricted (Specific roles/departments)</SelectItem>
                            <SelectItem value="closed">Closed (Invite only)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Determine who can access this group.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch("accessLevel") === "restricted" && (
                    <>
                      <FormField
                        control={form.control}
                        name="allowedRoles"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel className="text-base">Allowed Roles</FormLabel>
                              <FormDescription>Select which roles are allowed to join this group.</FormDescription>
                            </div>
                            {["Employee", "Manager", "Executive", "HR", "IT"].map((role) => (
                              <FormField
                                key={role}
                                control={form.control}
                                name="allowedRoles"
                                render={({ field }) => {
                                  return (
                                    <FormItem key={role} className="flex flex-row items-start space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(role)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, role])
                                              : field.onChange(field.value?.filter((value) => value !== role))
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{role}</FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="allowedDepartments"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel className="text-base">Allowed Departments</FormLabel>
                              <FormDescription>
                                Select which departments are allowed to join this group.
                              </FormDescription>
                            </div>
                            {["Sales", "Marketing", "Engineering", "Customer Support", "Finance"].map((department) => (
                              <FormField
                                key={department}
                                control={form.control}
                                name="allowedDepartments"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={department}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(department)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, department])
                                              : field.onChange(field.value?.filter((value) => value !== department))
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{department}</FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  <FormField
                    control={form.control}
                    name="externalCollaboration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow External Collaboration</FormLabel>
                          <FormDescription>Enable collaboration with users outside your organization.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dataClassification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Classification</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select data classification" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="internal">Internal</SelectItem>
                            <SelectItem value="confidential">Confidential</SelectItem>
                            <SelectItem value="restricted">Restricted</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Set the sensitivity level of data shared within this group.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ipRestriction"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">IP Restriction</FormLabel>
                          <FormDescription>Limit access to specific IP ranges.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {form.watch("ipRestriction") && (
                    <FormField
                      control={form.control}
                      name="allowedIpRanges"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allowed IP Ranges</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 192.168.1.0/24, 10.0.0.0/8" {...field} />
                          </FormControl>
                          <FormDescription>Enter comma-separated IP ranges in CIDR notation.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="squads">
              <Card>
                <CardHeader>
                  <CardTitle>Squad Management</CardTitle>
                  <CardDescription>Configure settings for sub-groups (squads) within this group</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="enableSquads"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Squads</FormLabel>
                          <FormDescription>Allow creation of sub-groups (squads) within this group.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {form.watch("enableSquads") && (
                    <>
                      <FormField
                        control={form.control}
                        name="maxSquadsPerGroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Squads</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Set a limit for the number of squads in this group (leave blank for unlimited).
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="squadCreationPermission"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Squad Creation Permission</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select who can create squads" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="all_members">All Members</SelectItem>
                                <SelectItem value="moderators">Moderators</SelectItem>
                                <SelectItem value="admins">Admins Only</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>Determine who can create new squads within the group.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="autoAssignSquads"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Auto-assign to Squads</FormLabel>
                              <FormDescription>
                                Automatically assign new members to squads based on their role or department.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="squadNamingConvention"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Squad Naming Convention</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. [Department]-[Project]-Squad" {...field} />
                            </FormControl>
                            <FormDescription>
                              Set a naming convention for squads (use placeholders like [Department], [Project], etc.)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions">
              <Card>
                <CardHeader>
                  <CardTitle>Permissions and Roles</CardTitle>
                  <CardDescription>Set up roles and permissions for group members</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="defaultMemberRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Member Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select default role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="contributor">Contributor</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>The default role assigned to new members.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="allowMemberInvites"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow Member Invites</FormLabel>
                          <FormDescription>Let members invite others to the group.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="allowContentCreation"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow Content Creation</FormLabel>
                          <FormDescription>Let members create posts and content.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="moderationLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Moderation Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select moderation level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Set the level of content moderation for the group.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contentApprovalRequired"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Content Approval Required</FormLabel>
                          <FormDescription>Require moderator approval for all new content.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="twoFactorAuthRequired"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Require Two-Factor Authentication</FormLabel>
                          <FormDescription>Enforce 2FA for all members of this group.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Settings</CardTitle>
                  <CardDescription>Configure what activities are allowed in the group</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="allowDiscussions"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow Discussions</FormLabel>
                          <FormDescription>Enable discussion threads in the group.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="allowEvents"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow Events</FormLabel>
                          <FormDescription>Let members create and manage events.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="allowFileSharing"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow File Sharing</FormLabel>
                          <FormDescription>Enable file uploads and sharing in the group.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="allowPolls"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow Polls</FormLabel>
                          <FormDescription>Enable creation of polls and surveys in the group.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="allowTaskAssignment"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow Task Assignment</FormLabel>
                          <FormDescription>Enable task creation and assignment within the group.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="activityFeed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Activity Feed</FormLabel>
                          <FormDescription>Show a feed of recent activities in the group.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                  <CardDescription>Configure settings for content within the group</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contentRetentionPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Retention Period (days)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Set how long content should be retained before automatic deletion (leave blank for
                          indefinite).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="autoArchiveInactiveContent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Auto-archive Inactive Content</FormLabel>
                          <FormDescription>
                            Automatically archive content that hasn&quot;t been interacted with for a while.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="enableVersioning"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Content Versioning</FormLabel>
                          <FormDescription>Keep track of changes made to content over time.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="enableTags"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Content Tags</FormLabel>
                          <FormDescription>Allow users to add tags to content for better organization.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {form.watch("enableTags") && (
                    <FormField
                      control={form.control}
                      name="mandatoryTags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mandatory Tags</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter comma-separated tags" {...field} />
                          </FormControl>
                          <FormDescription>
                            Specify tags that must be included with all content (comma-separated).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage notification settings for the group</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="notifyNewMembers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Notify on New Members</FormLabel>
                          <FormDescription>Send a notification when new members join.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notifyNewContent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Notify on New Content</FormLabel>
                          <FormDescription>Send a notification for new posts or content.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="digestFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Digest Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select digest frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="never">Never</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>How often to send activity digest emails to members.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="allowCustomNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow Custom Notifications</FormLabel>
                          <FormDescription>
                            Let group admins create custom notifications for important updates.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notificationChannels"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Notification Channels</FormLabel>
                          <FormDescription>Select which channels to use for notifications.</FormDescription>
                        </div>
                        {["email", "in-app", "push", "sms"].map((channel) => (
                          <FormField
                            key={channel}
                            control={form.control}
                            name="notificationChannels"
                            render={({ field }) => {
                              return (
                                <FormItem key={channel} className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(channel)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, channel])
                                          : field.onChange(field.value?.filter((value) => value !== channel))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {channel.charAt(0).toUpperCase() + channel.slice(1)}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integration">
              <Card>
                <CardHeader>
                  <CardTitle>Integration Settings</CardTitle>
                  <CardDescription>Configure integrations with external services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="enableSlackIntegration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Slack Integration</FormLabel>
                          <FormDescription>Connect this group to a Slack channel.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {form.watch("enableSlackIntegration") && (
                    <FormField
                      control={form.control}
                      name="slackWorkspace"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slack Workspace URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://your-workspace.slack.com" {...field} />
                          </FormControl>
                          <FormDescription>Enter the URL of your Slack workspace.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="enableMsTeamsIntegration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Microsoft Teams Integration</FormLabel>
                          <FormDescription>Connect this group to a Microsoft Teams channel.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {form.watch("enableMsTeamsIntegration") && (
                    <FormField
                      control={form.control}
                      name="msTeamsTeam"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Microsoft Teams Team ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter Teams Team ID" {...field} />
                          </FormControl>
                          <FormDescription>Enter the ID of your Microsoft Teams team.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <span className="flex items-center gap-1">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}

