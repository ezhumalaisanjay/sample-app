"use client"
import { Building2, CalendarDays, MapPin } from "lucide-react"
import UserDetails from "./user-details"
import Image from "next/image"
import bgProfileCover from "../../images/bg-profile-cover.jpg"
import { useState } from "react"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function Profile() {
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
      ]);
  
  return(
    <>
      <div className="m-4 min-h-screen flex flex-col font-sans">
        <div className="flex items-center m-4 justify-center relative lg:h-[160px] h-[120px]">
          <Image src={bgProfileCover} alt="cover Image" objectFit="cover" layout="fill" className=" rounded-lg" />
          <div className="w-[130px] h-[130px] rounded-full border-white border-4 mt-14 lg:mt-24 z-40 relative bg-slate-100">
            <Image src={"https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg"} width={100} height={100} alt="profile" className="absolute w-full object-cover left-0 rounded-full"/>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-9 lg:mt-12">
          <div className="text-lg font-semibold">{userDetails[0].name}</div>
          <div className="flex flex-wrap justify-center items-center gap-4 m-2">
            <div className="text-muted-foreground text-sm flex gap-2"><Building2 className="size-6 bg-amber-200 p-1 rounded-md text-amber-600" /> Htmlstream</div>
            <div className="text-muted-foreground text-sm flex gap-2"><MapPin className="size-6 bg-green-200 p-1 rounded-md text-green-600" />{userDetails[0].location}</div>
            <div className="text-muted-foreground text-sm flex gap-2"><CalendarDays className="size-6 bg-teal-200 p-1 rounded-md text-teal-600" /> Joined {format(userDetails[0].doj, "PP")}</div>
          </div>
        </div>
        <div className="m-3 mt-5 mb-5">
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <UserDetails userDetails={userDetails}/>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default Profile