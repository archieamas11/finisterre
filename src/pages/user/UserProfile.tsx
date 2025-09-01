import { User, Mail, Phone, Calendar, Edit3, Shield, Heart, TrendingUp, Award, Camera } from 'lucide-react'
import { useMemo, memo } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useMe } from '@/hooks/useMe'
import { useMyCustomer } from '@/hooks/useMyCustomer'

export default memo(function UserProfile() {
  const { user: meUser, isLoading: isMeLoading, isError: isMeError } = useMe()
  const { customer, isLoading: isCustomerLoading, isError: isCustomerError } = useMyCustomer()

  const isLoading = isMeLoading || isCustomerLoading
  const hasError = isMeError || isCustomerError

  // Memoize computed values
  const computed = useMemo(() => {
    const fullName = customer ? [customer.first_name, customer.middle_name, customer.last_name].filter(Boolean).join(' ') : meUser?.name || 'User'

    const initials = fullName
      .split(' ')
      .map((name) => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)

    // Calculate profile completion with more comprehensive fields
    const profileFields = [
      customer?.first_name,
      customer?.middle_name,
      customer?.last_name,
      customer?.email,
      customer?.contact_number,
      customer?.created_at,
      meUser?.name,
      meUser?.email,
    ]

    const totalFields = profileFields.length
    const completedFields = profileFields.filter((field) => (typeof field === 'string' ? field.trim() !== '' : Boolean(field))).length

    const completionPercentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0

    return {
      fullName,
      initials,
      completionPercentage,
      hasCompleteProfile: completionPercentage >= 80,
      memberSinceYear: customer?.created_at ? new Date(customer.created_at).getFullYear() : 2024,
      memberSinceDate: customer?.created_at ? new Date(customer.created_at).toLocaleDateString() : 'Not available',
    }
  }, [customer, meUser])

  const fullName = computed.fullName
  const initials = computed.initials
  const profileCompletion = computed.completionPercentage
  const hasCompleteProfile = computed.hasCompleteProfile
  const memberSinceYear = computed.memberSinceYear
  const memberSinceDate = computed.memberSinceDate

  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
    console.log('Edit profile clicked')
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Error State */}
      {hasError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-200">Unable to Load Profile</h3>
              <p className="text-sm text-red-600 dark:text-red-300">There was an error loading your profile information. Please try refreshing the page.</p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-xl sm:mb-8 dark:from-slate-900 dark:to-slate-800/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-gray-200 shadow-sm sm:h-20 sm:w-20" aria-hidden={isLoading}>
                {isLoading ? (
                  <div className="flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
                    <Skeleton className="h-12 w-12 rounded-full sm:h-16 sm:w-16" aria-label="loading avatar" />
                  </div>
                ) : (
                  <AvatarFallback className="bg-slate-100 text-lg font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300" aria-label={`Avatar for ${fullName}`}>
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -right-1 -bottom-1 h-7 w-7 rounded-full border-2 border-white p-0 shadow-sm sm:h-8 sm:w-8"
                onClick={() => console.log('Upload avatar')}
                aria-label="Upload profile picture"
                title="Change profile picture"
              >
                <Camera className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              </Button>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
                {isLoading ? <Skeleton className="h-6 w-32 sm:h-8 sm:w-48" /> : <span tabIndex={0}>{fullName}</span>}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Manage your account information</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant={meUser?.isAdmin ? 'default' : 'secondary'} className="text-xs" aria-label={meUser?.isAdmin ? 'Administrator role' : 'User role'}>
                  {meUser?.isAdmin ? 'Administrator' : 'User'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Active
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-start sm:justify-end">
            <Button onClick={handleEditProfile} className="w-full sm:w-auto" aria-label="Edit profile">
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="mt-6 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/30">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">Profile Completion</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white" aria-label={`Profile ${profileCompletion}% complete`}>
                {profileCompletion}%
              </span>
              {hasCompleteProfile && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" aria-label="Profile is complete">
                  Complete
                </Badge>
              )}
            </div>
          </div>
          <div role="progressbar" aria-valuenow={profileCompletion} aria-valuemin={0} aria-valuemax={100} aria-label="Profile completion progress">
            <Progress value={profileCompletion} className="mt-2 h-2" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <section className="mb-6" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Profile Statistics
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm transition-all duration-200 hover:shadow-md dark:from-blue-950/50 dark:to-indigo-950/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <Heart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400" aria-label={`${customer?.lot_info?.length ?? 0} memorials`}>
                    {isLoading ? <Skeleton className="h-5 w-6" /> : (customer?.lot_info?.length ?? 0)}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Memorials</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 shadow-sm transition-all duration-200 hover:shadow-md dark:from-emerald-950/50 dark:to-green-950/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20">
                  <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold text-green-600 dark:text-green-400" aria-label={`Profile ${profileCompletion}% complete`}>
                    {profileCompletion}%
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 shadow-sm transition-all duration-200 hover:shadow-md dark:from-purple-950/50 dark:to-violet-950/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400" aria-label={`Account type: ${meUser?.isAdmin ? 'Administrator' : 'User'}`}>
                    {meUser?.isAdmin ? 'Admin' : 'User'}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Account</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm transition-all duration-200 hover:shadow-md dark:from-amber-950/50 dark:to-orange-950/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400" aria-label={`Member since ${memberSinceYear}`}>
                    {memberSinceYear}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Member</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Profile Information */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="bg-gradient-to-br from-white to-slate-50/50 shadow-xl dark:from-slate-900 dark:to-slate-800/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Your basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Full Name</p>
                <p className="font-semibold text-slate-900 dark:text-white">{isLoading ? <Skeleton className="h-4 w-24" /> : fullName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20">
                <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Email Address</p>
                <p className="font-semibold text-slate-900 dark:text-white">{isLoading ? <Skeleton className="h-4 w-32" /> : customer?.email || meUser?.email || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <Phone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Phone Number</p>
                <p className="font-semibold text-slate-900 dark:text-white">{isLoading ? <Skeleton className="h-4 w-24" /> : customer?.contact_number || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-900/20">
                <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Member Since</p>
                <p className="font-semibold text-slate-900 dark:text-white">{isLoading ? <Skeleton className="h-4 w-20" /> : memberSinceDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-slate-50/50 shadow-xl dark:from-slate-900 dark:to-slate-800/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" />
              Account Status
            </CardTitle>
            <CardDescription>Your current account status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <Shield className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Account Type</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Your current role</p>
                </div>
              </div>
              <Badge variant={meUser?.isAdmin ? 'default' : 'secondary'} className="text-xs">
                {meUser?.isAdmin ? 'Administrator' : 'User'}
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20">
                  <Award className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Account Status</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Current status</p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-500 text-xs hover:bg-green-600">
                Active
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <Heart className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Connected Memorials</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Total memorials</p>
                </div>
              </div>
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{customer?.lot_info?.length ?? 0}</span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <TrendingUp className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Last Login</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Recent activity</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Today</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
})
