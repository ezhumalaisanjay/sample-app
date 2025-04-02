import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/ui/theme-provider"
import SiteHeader from "@/pages/ui/header"
import ProfileSettingsStepForm from "@/pages/ui/profile/stepform"
import AppSidebar from "@/pages/ui/sidebar"
import axios from "axios"
import { CalendarDays, CalendarX, Frame, LucideIcon, PackagePlus, PersonStanding, PieChart, Proportions, Settings } from "lucide-react"
import { useEffect, useState } from "react"

interface TenantResponse {
  ClientId: string
  TenantData: {
    UserID: string
    admin_email: string
    admin_name: string
    client_id: string
    createdAt: string
    group_name: string
    id: string
    identity_pool_id: string
    phone_number: string 
    tenant_name: string
    updatedAt: string
    user_pool_id: string
  }
}

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface Project {
  name: string;
  url: string;
  icon: LucideIcon; // React component for the icon
}

interface Data {
  user: User;
  projects: Project[];
}

function EditProfilePage() {
  const [ isActive, setIsActive ] = useState<number>(2);
  const [groupData, setGroupData] = useState<string | null>();
  const [breadCrumbs, setBreadCrumbs] = useState(
    [
      {
        index: 0,
        name: "Dashboard",
        url: "/employee/dashboard",
      }, {
        index: 1,
        name: "Profile",
        url: "/profile",
      }, {
        index: 2,
        name: "Edit Profile",
        url: "/profile/editprofile",
      },
    ]
  );
  const [data, setData] = useState<Data>(
    {
      user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
      },
      projects: [
        {
          name: "Dashboard",
          url: "/employee/dashboard",
          icon: Frame,
        },
        {
          name: "Leave Tracker",
          url: "/employee/leavetracker",
          icon: PieChart,
        },
        {
          name: "Attendance",
          url: "/employee/attendance",
          icon: CalendarDays,
        },
      ],
    }
  );

  useEffect(() => {
    const fetchingData = async () => {
      const email = localStorage.getItem("email") || "default@example.com"
      try {
        const { data }: { data: TenantResponse } = await axios.post(
          "/api/getTenantUserPool",
          {
            email: email,
          }
        );

        setGroupData(data?.TenantData.group_name);

      } catch (err: any) {
        console.error("❌ error:", err.message);
      }
    }

    fetchingData();

  }, []);

  useEffect(() => {
    if(groupData === "tenant") {
      setData({
        user: {
          name: "shadcn",
          email: "m@example.com",
          avatar: "/avatars/shadcn.jpg",
        },
        projects: [
          {
            name: "Dashboard",
            url: "/tenant/dashboard",
            icon: Frame,
          },
          {
            name: "Other",
            url: "/tenant/other",
            icon: PieChart,
          },
          {
            name: "Users",
            url: "/tenant/users",
            icon: PersonStanding,
          },
          {
            name: "Settings",
            url: "/tenant/settings",
            icon: Settings,
          },
        ],
      });

      setBreadCrumbs(
        [
          {
            index: 0,
            name: "Dashboard",
            url: "/tenant/dashboard",
          }, {
            index: 1,
            name: "Profile",
            url: "/profile",
          }, {
            index: 2,
            name: "Edit Profile",
            url: "/profile/editprofile",
          },
        ]
      )
      
    } else if (groupData === "hr") {
      setData({
        user: {
          name: "shadcn",
          email: "m@example.com",
          avatar: "/avatars/shadcn.jpg",
        },
        projects: [
          {
            name: "Dashboard",
            url: "/hr/dashboard",
            icon: Frame,
          },
          {
            name: "Onboarding",
            url: "/hr/onboarding",
            icon: PackagePlus,
          },
          {
            name: "Users",
            url: "/hr/users",
            icon: PersonStanding,
          },
          {
            name: "Leave Tracker",
            url: "/hr/leavetracker",
            icon: CalendarX,
          },
          {
            name: "Attendance",
            url: "/hr/attendance",
            icon: CalendarDays,
          },
          {
            name: "Reports",
            url: "/hr/reports",
            icon: Proportions,
          },
          {
            name: "Settings",
            url: "/hr/settings",
            icon: Settings,
          },
        ],
      });

      setBreadCrumbs(
        [
          {
            index: 0,
            name: "Dashboard",
            url: "/hr/dashboard",
          }, {
            index: 1,
            name: "Profile",
            url: "/profile",
          }, {
            index: 2,
            name: "Edit Profile",
            url: "/profile/editprofile",
          },
        ]
      )

    } else {
      setData({
        user: {
          name: "shadcn",
          email: "m@example.com",
          avatar: "/avatars/shadcn.jpg",
        },
        projects: [
          {
            name: "Dashboard",
            url: "/employee/dashboard",
            icon: Frame,
          },
          {
            name: "Leave Tracker",
            url: "/employee/leavetracker",
            icon: PieChart,
          },
          {
            name: "Attendance",
            url: "/employee/attendance",
            icon: CalendarDays,
          },
        ],
      })
    }
  }, [groupData])

  const [userDetails, setUserDetails] = useState(
    [
      {
        name: "Jesse Pinkman",
        profile: "https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg",
        role: "Developer",
        location: "Chennai, India",
        department: "DevOps",
        shift: "General",
        TimeZone: "(GMT+05:30)",
        seatingLocation: "Anna Nagar",
        email: "jessepinkman@example.com",
        mobileNo: "9876543210",
        workNo: "9876543210",
        about: "New Joining",
        employeeID: "Example-1234",
        nickName: "-",
        firstName: "Jesse",
        lastName: "Pinkman",
        division: "-",
        designation: "Developer",
        employmentType: "Permanent",
        employeeStatus: "Active",
        source: "Linkedin",
        doj: "11-12-2023",
        experience: "1 month(s)",
        dob: "11-12-2002",
        maritalStatus: "Single",
        gender: "Male",
        expertise: "-",
        tags: "-",
        address: "XYZ Street, MM Nagar, YYY - 101",
      }
    ]
  );

  const handleClick = (id: number) => {
    setIsActive(id);
  }

  return(
    <>  
      <ThemeProvider>
        <div className="[--header-height:calc(theme(spacing.14))] flex w-full">
          <SidebarProvider>
            <SiteHeader isActive={isActive} handleClick={handleClick} breadCrumbs={breadCrumbs} />
            <div className="flex flex-1">
              <AppSidebar data={data} isActive={isActive} handleClick={handleClick}/>
              <SidebarInset>
                <div className="flex flex-1 flex-col gap-4 mt-10 p-4">
                  <ProfileSettingsStepForm userDetails={userDetails}/>
                </div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </div>
      </ThemeProvider>
    </>
  )
}

export default EditProfilePage